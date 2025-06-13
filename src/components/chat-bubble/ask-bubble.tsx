import type {Component} from "solid-js";

type AskBubbleProps = {
    message: string;
};

const AskBubble: Component<AskBubbleProps> = (props) => {
    return (
        <div class="chat chat-end">
            <div class="chat-bubble">{props.message}</div>
        </div>
    )
}

export default AskBubble
