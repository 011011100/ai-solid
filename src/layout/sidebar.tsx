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

    function getHistoryMessage (conversationId: string): void {
        const {removeAllMessage,getMessage} = useMessagesStore()
        removeAllMessage()
        getMessage(conversationId);
    }

    return (
        <ul class="menu bg-base-200 rounded-box w-56">
            {conversationIdList().map((text:string) =>{
                return<li onClick={() => getHistoryMessage(text)}><a>{text}</a></li>
            })}
        </ul>
    )
}

export default sidebar
