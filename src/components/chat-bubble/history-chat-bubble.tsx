import {useMessagesStore} from "../../stores/chat-message-store.js";
import AnswerBubble from "./answer-bubble.js";
import AskBubble from "./ask-bubble.js";
import type {Component} from "solid-js";

const HistoryChatBubble: Component = () => {
    const {messages} = useMessagesStore();
    return (
        <>
            {messages.map(msg => {
                return (
                    msg.type === 'ask' ?
                        <AskBubble message={msg.message}/> :
                        <AnswerBubble message={msg.message}/>
                )
            })}
        </>
    )
}

export default HistoryChatBubble
