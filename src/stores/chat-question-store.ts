import {createSignal, onCleanup} from "solid-js";
import {ResponseParser} from "../type/response-parser.js";

let store: ReturnType<typeof createChatQuestionStore>;

function createChatQuestionStore(){
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

    function askQuestion(){
        let lastUpdate = Date.now();
        setInside(true)

        const detectThink = createThinkBlockDetector()

        const es = new EventSource(`http://localhost:8080/ai2?question=${question()}`);

        removeQuestion()

        es.onmessage = (e) => {
            lastUpdate = Date.now();
            let data: ResponseParser = new ResponseParser(JSON.parse(e.data));
            let text = data.getText();
            const inside = detectThink(text)
            if (isStart.test(text) || isEnd.test(text)) {
                text = ''
            }

            setMessagesArray(prev => [...prev, e.data]);
            if (inside) {
                setThinkMessages(str => str + text);
            } else {
                setAnswer(str => str + text);
            }
            setInside(inside)

            if (data.result.metadata.finishReason === 'stop') {
                es.close();
                // 停止心跳
                clearInterval(heartbeat);
            }
        };

        es.onerror = () => {
            es.close(); /* 可做重连处理 */
        };

        const heartbeat = setInterval(() => {
            const now = Date.now();
            if (now - lastUpdate > 10_000) { // 超过10秒未收到数据
                console.warn("检测到流可能已停止");
                es.close();
                clearInterval(heartbeat);
            }
        }, 1000);

        onCleanup(() => es.close());
    }

    return{
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
