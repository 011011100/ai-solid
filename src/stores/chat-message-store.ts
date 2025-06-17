import {createStore} from 'solid-js/store';
import type {ChatBubble} from "../type/chat-bubble.js";
import {getHistoryMessageApi} from "../api/api.js";
import {useEventSource} from "../utils/use-event-source.js";
import {createEffect} from "solid-js";
import chatMessage from "../type/chat-message.js";
import ChatMessage from "../type/chat-message.js";

let store: ReturnType<typeof createMessagesStore>;

function createMessagesStore() {
    const [messages, setMessages] = createStore<ChatBubble[]>([]);

    function getMessage(conversationId: string) {
        const {data} = useEventSource<chatMessage>(getHistoryMessageApi(conversationId));
        createEffect(() =>{
            const d = data();
            const isThink = /(<think>[\s\S]*<\/think>)/;
            if (d) {
                let chatMessage = new ChatMessage(d);
                chatMessage.text = chatMessage.text.replace(isThink, '');
                switch (chatMessage.messageType) {
                    case "USER":
                        addMessage({type: 'ask',message: chatMessage.text});
                        break;
                    case "ASSISTANT":
                        addMessage({type: 'answer',message: chatMessage.text});
                        break;
                    default:
                        break;
                }
                console.log(data())
            }
        })
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

    return {
        messages,
        getMessage,
        addMessage,
        updateMessage,
        removeMessage
    };
}

export function useMessagesStore() {
    if (!store) store = createMessagesStore();
    return store;
}
