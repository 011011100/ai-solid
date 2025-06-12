import { createStore } from 'solid-js/store';
import type {ChatBubble} from "../type/chat-bubble.js";

let store: ReturnType<typeof createMessagesStore>;

function createMessagesStore() {
    const [messages, setMessages] = createStore<ChatBubble[]>([]);

    function addMessage(item: ChatBubble) {
        setMessages(prev => [...prev, item]);
    }

    function updateMessage(index: number, updated: Partial<ChatBubble>) {
        setMessages(index, msg => ({ ...msg, ...updated }));
    }

    function removeMessage(index: number) {
        setMessages(prev => prev.filter((_, i) => i !== index));
    }

    return {
        messages,
        addMessage,
        updateMessage,
        removeMessage
    };
}

export function useMessagesStore() {
    if (!store) store = createMessagesStore();
    return store;
}
