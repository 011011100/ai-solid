import {createSignal, onCleanup} from "solid-js";
import MarkdownIt from 'markdown-it';

const Chat = () => {
    // const [question, setQuestion] = createSignal<string>()
    const [messagesArray, setMessagesArray] = createSignal<string[]>([]);
    const [thinkMessages, setThinkMessages] = createSignal<string>("");
    const [askmessages, setAskMessages] = createSignal<string>("");

    function fixMarkdownSpacing(chunk: string): string {
        return chunk
            .replace(/^(#{1,6})/, '$1 ')     // 修复标题 ###
            .replace(/^([-+]+)/, '$1 ')        // 修复无序列表 -内容
            .replace(/^(\d+\.)/, '$1 ');    // 修复有序列表 1.内容
    }

    const isStart = /<think>/;
    const isEnd = /<\/think>/;

    function createThinkBlockDetector() {
        let insideBlock = false;

        return function detectThinkBlock(chunk: string): boolean {

            // 状态更新
            if (isStart.test(chunk)) insideBlock = true;
            if (isEnd.test(chunk)) insideBlock = false;

            return insideBlock
        };
    }

    const [inside, setInside] = createSignal<boolean>(false)

    const md = new MarkdownIt();

    function askQuestion(_question: string) {
        let lastUpdate = Date.now();

        const detectThink = createThinkBlockDetector()

        const es = new EventSource('http://localhost:8080/ai2?question=请你输出一段markdown文档的有序列表');

        es.onmessage = (e) => {
            lastUpdate = Date.now();
            let data = e.data;

            const inside = detectThink(data)
            if (isStart.test(data) || isEnd.test(data)){
                data = ''
            }else {
                data = fixMarkdownSpacing(data);
            }

            setMessagesArray(prev => [...prev, e.data]);
            if (inside) {
                setThinkMessages(str => str + data);
            }else {
                setAskMessages(str => str + data);
            }
            setInside(inside)
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

    return (
        <div>
            <h1>Home</h1>
            <div>
                {inside() ? <p>思考中</p> : <></>}
                <div style={{
                    display: "flex",
                    "flex-direction": 'row',
                    "flex-wrap": "wrap",
                    "margin-top": "10px",
                    "margin-bottom": "10px"
                }}>
                    <div>
                        {thinkMessages()}
                    </div>
                    <div
                        class="markdown-body"
                        innerHTML={md.render(askmessages())}
                    />
                </div>
            </div>
            <button onClick={() => askQuestion("你是谁")}>
                click
            </button>
        </div>
    )
}

export default Chat
