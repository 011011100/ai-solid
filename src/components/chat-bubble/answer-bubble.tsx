import MarkdownIt from "markdown-it";
import type {Component} from "solid-js";

const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});

type AnswerBubbleProps = {
    message: string;
};

const AnswerBubble: Component<AnswerBubbleProps> = (props) => {
    const html = () => md.render(props.message);
    return (
        <div class="chat chat-start">
            <div class="chat-bubble">
                <div
                    class="markdown-body"
                    innerHTML={html()}
                />
            </div>
        </div>
    );
};

export default AnswerBubble;
