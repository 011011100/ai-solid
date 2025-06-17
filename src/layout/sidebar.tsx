import {type Component, createEffect, createSignal} from "solid-js";
import {getHistoryConversationIdApi} from "../api/api.js";
import {useEventSource} from "../utils/use-event-source.js";
import {useMessagesStore} from "../stores/chat-message-store.js";

const sidebar: Component = () => {
    const {data} = useEventSource<Array<string>>(getHistoryConversationIdApi());

    const [conversationIdList, setConversationId] = createSignal<Array<string>>([]);
    createEffect(() => {
        let d = data()
        if (d) {
            setConversationId([...d])
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
                {conversationIdList().map((text: string) => {
                    return <li class='text-base' onClick={() => getHistoryMessage(text)}>
                        <a>
                            {text}
                        </a>
                    </li>
                })}
            </ul>
        </>
    )
}

export default sidebar
