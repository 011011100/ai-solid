import {type Component, createEffect, createSignal} from "solid-js";
import {getHistoryConversationApi} from "../api/api.js";
import {useEventSource} from "../utils/use-event-source.js";
import {useMessagesStore} from "../stores/chat-message-store.js";
import  HistoryConversation from "../type/history-conversation.js";

const sidebar: Component = () => {
    const {data} = useEventSource<Array<HistoryConversation>>(getHistoryConversationApi());

    const [historyConversation, setHistoryConversation] = createSignal<Array<HistoryConversation>>([]);
    createEffect(() => {
        let d = data()
        if (d) {
            setHistoryConversation([...d])
        }
    })

    const {removeAllMessage, getMessage} = useMessagesStore()

    function getHistoryMessage(conversationId: string): void {
        removeAllMessage()
        getMessage(conversationId);
    }

    function newQuestion() {
        removeAllMessage()
    }

    return (
        <>
            <ul class="menu bg-base-200 rounded-box w-56">
                <li onClick={() => newQuestion()}>
                    <a class='flex items-center'>
                        <IconMdiFileDocumentPlusOutline class="w-4 h-4"/>
                        <p class='text-base'>新问题</p>
                    </a>
                </li>
            </ul>
            <ul class="menu bg-base-200 rounded-box w-56">
                <li class='menu-title'>聊天</li>
                {historyConversation().map((data: HistoryConversation) => {
                    return <li class='text-base' onClick={() => getHistoryMessage(data.conversationId)}>
                        <a>
                            {data.problemSummary}
                        </a>
                    </li>
                })}
            </ul>
        </>
    )
}

export default sidebar
