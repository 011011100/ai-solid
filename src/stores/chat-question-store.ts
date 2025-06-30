import {createSignal} from "solid-js";
import {ResponseParser} from "../type/response-parser.js";
import {useMessagesStore} from "./chat-message-store.js";
import {useEventSource} from "../utils/use-event-source.js";
import {useChatConversationStore} from "./chat-conversation-store.js";
import {useChatModelStore} from "./chat-model-store.js";
import {notify} from "../components/notification-context/global-notifier.js";
import {
    askQuestionApi2,
    createTitleApi,
    onlineSearchApi
} from "../api/default-chat-api.js";
import type {NewsResponse} from "../type/online-response.js";
import {startStream} from "../utils/start-stream.js";

let store: ReturnType<typeof createChatQuestionStore>;

function createChatQuestionStore() {
    const [question, setQuestion] = createSignal<string>('');

    const [isOnline, setOnline] = createSignal<boolean>(false);

    function addQuestion(item: string) {
        setQuestion(item);
    }

    function removeQuestion() {
        setQuestion('');
    }

    // const isStart = /<think>/;
    // const isEnd = /<\/think>/;

    // 是否思考
    const [inside, setInside] = createSignal<boolean>(false)

    // function createThinkBlockDetector() {
    //     let insideBlock = false;
    //
    //     return function detectThinkBlock(chunk: string): boolean {
    //
    //         // 状态更新
    //         if (isStart.test(chunk)) insideBlock = true;
    //         if (isEnd.test(chunk)) insideBlock = false;
    //
    //         return insideBlock
    //     };
    // }

    // 消息列
    const [messagesArray, setMessagesArray] = createSignal<string[]>([]);
    // 思考列
    const [thinkMessages, setThinkMessages] = createSignal<string>("");
    // 回答列
    const [answer, setAnswer] = createSignal<string>("");

    const messagesStore = useMessagesStore()

    const [conversationId, setConversationId] = createSignal<string>(crypto.randomUUID().replace("-", ""));

    const [isNewQuestion, setIsNewQuestion] = createSignal<boolean>(true);

    async function askQuestion() {
        const q = question()

        const chatModelStore = useChatModelStore()
        if (!chatModelStore.model()) {
            notify("请选择模型", "error")
            return
        }
        messagesStore.addMessage({type: 'ask', message: q})
        setInside(true)

        let onlineSearch
        // ✅ 联网搜索封装成 Promise
        if (isOnline()) {
            await new Promise<void>((resolve, reject) => {
                useEventSource<NewsResponse>(onlineSearchApi(q), {
                    connectTimeout: -1,
                    idleTimeout: -1,
                    onMessage: (data) => {
                        // 你可以在这里处理 data
                        console.log("联网数据", data)
                        onlineSearch = data.choices[0].message.content
                        // ✅ 根据某种结束条件判断搜索已完成
                        resolve()
                    },
                    onError: () => {
                        console.error("查询失败")
                        reject()
                    }
                })
            })
        }

        // ✅ 等联网完成后再执行下方逻辑

        removeQuestion();
        setAnswer("");
        setThinkMessages("");

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

        const cleanup = startStream({
            url: askQuestionApi2(),
            body: {
                question: q,
                conversationId: conversationId(),
                modelName: chatModelStore.model(),
                onlineSearch: onlineSearch
            },
            heartbeatTimeout: -1,
            connectionTimeout: -1,
            onData: (data) => {
                let res: ResponseParser = new ResponseParser(data);
                let text = res.getText();
                // const inside = detectThink(text)
                // if (isStart.test(text) || isEnd.test(text) || text === null) {
                //     text = ''
                // }
                let inside = true
                if (text !== null) {
                    inside = false
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
                    cleanup();
                }
            },
            onError: () => {
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
        isOnline,
        setOnline,
        setConversationId,
        setIsNewQuestion,
    }
}

export function useChatQuestionStore() {
    if (!store) store = createChatQuestionStore();
    return store;
}
