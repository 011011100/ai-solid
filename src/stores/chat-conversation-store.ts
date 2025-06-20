import {createEffect, createSignal} from "solid-js";
import HistoryConversation from "../type/history-conversation.js";
import {useEventSource} from "../utils/use-event-source.js";
import {getHistoryConversationApi} from "../api/api.js";

let store: ReturnType<typeof createChatConversationStore>;

function createChatConversationStore() {
    const [historyConversation, setHistoryConversation] = createSignal<Array<HistoryConversation>>([]);

    function getAllConversation() {
        const {data} = useEventSource<Array<HistoryConversation>>(getHistoryConversationApi());
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

    return {
        historyConversation,
        getAllConversation,
        addConversation,
    }
}

export function useChatConversationStore() {
    if (!store) store = createChatConversationStore();
    return store;
}
