import {createStore} from 'solid-js/store';
import type {ChatBubble} from "../type/chat-bubble.js";
import {useEventSource} from "../utils/use-event-source.js";
import chatMessage from "../type/chat-message.js";
import ChatMessage from "../type/chat-message.js";
import {getHistoryMessageApi} from "../api/default-chat-api.js";

let store: ReturnType<typeof createMessagesStore>;

function createMessagesStore() {
    const [messages, setMessages] = createStore<ChatBubble[]>([]);

    function getMessage(conversationId: string) {
        useEventSource<chatMessage>(getHistoryMessageApi(conversationId), {
            onMessage: (d) => {
                const isThink = /(<think>[\s\S]*<\/think>)/;
                const chatMessage = new ChatMessage(d);
                chatMessage.text = chatMessage.text.replace(isThink, '');

                switch (chatMessage.messageType) {
                    case "USER":
                        addMessage({ type: "ask", message: chatMessage.text });
                        break;
                    case "ASSISTANT":
                        addMessage({ type: "answer", message: chatMessage.text });
                        break;
                }
            }
        });
        return messages;
    }

    function addMessage(item: ChatBubble) {
        setMessages(prev => [...prev, item]);
    }

    function updateMessage(index: number, updated: Partial<ChatBubble>) {
        setMessages(index, msg => ({...msg, ...updated}));
    }

    function removeMessage(index: number) {
        setMessages(prev => prev.filter((_, i) => i !== index));
    }

    function removeAllMessage() {
        setMessages([]);
    }

    return {
        messages,
        getMessage,
        addMessage,
        updateMessage,
        removeMessage,
        removeAllMessage,
    };
}

export function useMessagesStore() {
    if (!store) store = createMessagesStore();
    return store;
}
