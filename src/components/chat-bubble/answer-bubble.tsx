import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export default function answerBubble(message: string) {
    return (
        <div class="chat chat-end">
            <div class="chat-bubble">
                <div
                    class="markdown-body"
                    innerHTML={md.render(message)}
                />
            </div>
        </div>
    )
}
