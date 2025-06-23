import {createEffect, createSignal} from "solid-js";
import HistoryConversation from "../type/history-conversation.js";
import {useEventSource} from "../utils/use-event-source.js";
import {defaultChatApi} from "../api/default-chat-api.js";

let store: ReturnType<typeof createChatConversationStore>;

function createChatConversationStore() {
    const [historyConversation, setHistoryConversation] = createSignal<Array<HistoryConversation>>([]);

    function getAllConversation() {
        const {data} = useEventSource<Array<HistoryConversation>>(defaultChatApi().getHistoryConversationApi());
        createEffect(() =>{
            let d = data()
            if (d) {
                setHistoryConversation([...d])
            }
        })
    }

    function addConversation(item: HistoryConversation) {
        setHistoryConversation(prev => [item,...prev]);
    }

    function updateConversation(item: HistoryConversation) {
        setHistoryConversation(prev => prev.map((conversation) => conversation.conversationId === item.conversationId ? item : conversation));
    }

    return {
        historyConversation,
        getAllConversation,
        addConversation,
        updateConversation,
    }
}

export function useChatConversationStore() {
    if (!store) store = createChatConversationStore();
    return store;
}
