import {createSignal} from "solid-js";
import {ResponseParser} from "../type/response-parser.js";
import {useMessagesStore} from "./chat-message-store.js";
import {useEventSource} from "../utils/use-event-source.js";
import {useChatConversationStore} from "./chat-conversation-store.js";
import {useChatModelStore} from "./chat-model-store.js";
import {notify} from "../components/notification-context/global-notifier.js";
import {askQuestionApi, createTitleApi} from "../api/default-chat-api.js";

let store: ReturnType<typeof createChatQuestionStore>;

function createChatQuestionStore() {
    const [question, setQuestion] = createSignal<string>('');

    function addQuestion(item: string) {
        setQuestion(item);
    }

    function removeQuestion() {
        setQuestion('');
    }

    const isStart = /<think>/;
    const isEnd = /<\/think>/;

    // 是否思考
    const [inside, setInside] = createSignal<boolean>(false)

    function createThinkBlockDetector() {
        let insideBlock = false;

        return function detectThinkBlock(chunk: string): boolean {

            // 状态更新
            if (isStart.test(chunk)) insideBlock = true;
            if (isEnd.test(chunk)) insideBlock = false;

            return insideBlock
        };
    }

    // 消息列
    const [messagesArray, setMessagesArray] = createSignal<string[]>([]);
    // 思考列
    const [thinkMessages, setThinkMessages] = createSignal<string>("");
    // 回答列
    const [answer, setAnswer] = createSignal<string>("");

    const messagesStore = useMessagesStore()

    const [conversationId, setConversationId] = createSignal<string>(crypto.randomUUID().replace("-", ""));

    const [isNewQuestion, setIsNewQuestion] = createSignal<boolean>(true);

    function askQuestion() {
        const q = question()

        const chatModelStore = useChatModelStore()
        if (!chatModelStore.model()) {
            notify("请选择模型", "error")
            return;
        }

        messagesStore.addMessage({type: 'ask', message: q})

        removeQuestion();
        setAnswer("");
        setThinkMessages("");

        setInside(true)
        if (isNewQuestion()) {
            const conversationStore = useChatConversationStore()
            conversationStore.addConversation({
                conversationId: conversationId(),
                problemSummary: "新问题"
            })

            useEventSource<string>(createTitleApi(q, conversationId(), chatModelStore.model()), {
                connectTimeout: -1,
                idleTimeout: -1,
                onMessage: (data) => {

                    conversationStore.updateConversation({
                        conversationId: conversationId(),
                        problemSummary: data
                    })
                }
            });

            setIsNewQuestion(false);
        }

        const index = messagesStore.messages.length

        const detectThink = createThinkBlockDetector()

        const {
            stop: askStop
        } = useEventSource<ResponseParser>(askQuestionApi(q, conversationId(), chatModelStore.model()), {
            onMessage: (data) => {
                // 这里的逻辑会在 data() 每次变化时执行
                let res: ResponseParser = new ResponseParser(data);
                let text = res.getText();
                const inside = detectThink(text)
                if (isStart.test(text) || isEnd.test(text) || text === null) {
                    text = ''
                }

                setMessagesArray(prev => [...prev, text]);
                if (inside) {
                    setThinkMessages(str => str + text);
                } else {
                    setAnswer(str => str + text);
                    messagesStore.updateMessage(index, {type: 'answer', message: answer()})
                }
                setInside(inside)

                if (res.result.metadata.finishReason === 'stop') {
                    askStop();
                }
            }
        });
    }

    return {
        question,
        addQuestion,
        removeQuestion,
        askQuestion,
        inside,
        messagesArray,
        thinkMessages,
        answer,
        conversationId,
        setConversationId,
        setIsNewQuestion,
    }
}

export function useChatQuestionStore() {
    if (!store) store = createChatQuestionStore();
    return store;
}
