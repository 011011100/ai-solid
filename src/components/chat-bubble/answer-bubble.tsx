import markdownIt from "markdown-it";
import type {Component} from "solid-js";
import hljs from "highlight.js";
import 'highlight.js/styles/atom-one-light.css';
import type MarkdownIt from "markdown-it/index.js"; // 也可以用 'atom-one-dark.css' 等

const md:MarkdownIt = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks:true,
    highlight(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs p-2 bg-[#f9f9f9] rounded-lg border-solid border-1 border-[#e5e5e5]"><code>${hljs.highlight(code, {language: lang}).value}</code></pre>`;
            } catch (_) {
            }
        }
        return `<pre class="hljs p-2 bg-[#f9f9f9] rounded-lg border-solid border-1 border-[#e5e5e5]"><code>${md.utils.escapeHtml(code)}</code></pre>`;
    },
});

type AnswerBubbleProps = {
    message: string;
};

const AnswerBubble: Component<AnswerBubbleProps> = (props) => {
    const html = () => md.render(props.message);
    console.log(html())
    return (
        <div class="card p-4 mb-2 mt-4">
            <div
                class="markdown-body prose prose-base leading-loose"
                innerHTML={html()}
            />
        </div>
    );
};

export default AnswerBubble;
