import {createEffect, createSignal} from "solid-js";
import {ResponseParser} from "../type/response-parser.js";
import {useMessagesStore} from "./chat-message-store.js";
import {useEventSource} from "../utils/use-event-source.js";
import {askQuestionApi} from "../api/api.js";

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

    const {addMessage, updateMessage, messages} = useMessagesStore()

    function askQuestion() {
        const q = question()
        addMessage({type: 'ask', message: q})
        removeQuestion();

        setAnswer("");
        setThinkMessages("");
        setInside(true)

        const index = messages.length

        const detectThink = createThinkBlockDetector()

        let {data, stop} = useEventSource<ResponseParser>(askQuestionApi(q, '002'));

        createEffect(() => {
            const d = data();
            if (d) {
                // 这里的逻辑会在 data() 每次变化时执行
                let res: ResponseParser = new ResponseParser(d);
                let text = res.getText();
                const inside = detectThink(text)
                if (isStart.test(text) || isEnd.test(text)) {
                    text = ''
                }

                setMessagesArray(prev => [...prev, text]);
                if (inside) {
                    setThinkMessages(str => str + text);
                } else {
                    setAnswer(str => str + text);
                    updateMessage(index, {type: 'answer', message: answer()})
                }
                setInside(inside)

                if (res.result.metadata.finishReason === 'stop') {
                    stop();
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
    }
}

export function useChatQuestionStore() {
    if (!store) store = createChatQuestionStore();
    return store;
}
