import askBubble from "./ask-bubble.js";
import answerBubble from "./answer-bubble.js";
import type {ChatBubble} from "../../type/chat-bubble.js";


export default function historyChatBubble(props: ChatBubble[]) {
    return (
        <>
            {props.map( prop => {
                return (
                    prop.type === 'ask' ?
                        askBubble(prop.message) :
                        answerBubble(prop.message)
                )
            })}
        </>
    )
}
