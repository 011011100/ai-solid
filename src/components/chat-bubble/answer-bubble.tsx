import markdownIt from "markdown-it";
import type {Component} from "solid-js";
import hljs from "highlight.js";
import 'highlight.js/styles/atom-one-light.css';
import type MarkdownIt from "markdown-it/index.js"; // 也可以用 'atom-one-dark.css' 等
import './markdown-body.css'
// @ts-ignore
import katex from 'markdown-it-katex';
import 'katex/dist/katex.min.css';
import {addSafeInlineMath} from "../../utils/markdown-viewer.js";

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
}).use(katex);

addSafeInlineMath(md);

// 添加自定义 link 样式
const defaultLinkRender = md.renderer.rules.link_open || function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    // 添加 class
    const classIndex = token.attrIndex('class');
    const customClasses = 'text-blue-600 hover:underline hover:text-blue-800 font-medium';

    if (classIndex < 0) {
        token.attrPush(['class', customClasses]);
    } else {
        token.attrs![classIndex][1] += ' ' + customClasses;
    }

    // 安全性增强：target="_blank" 和 rel="noopener noreferrer"
    token.attrSet('target', '_blank');
    token.attrSet('rel', 'noopener noreferrer');

    return defaultLinkRender(tokens, idx, options, env, self);
};

type AnswerBubbleProps = {
    message: string;
};

const AnswerBubble: Component<AnswerBubbleProps> = (props) => {
    const html = () => md.render(props.message);
    return (
        <div class="card p-4 mb-2 mt-4">
            <div
                class="markdown-body prose prose-base"
                innerHTML={html()}
            />
        </div>
    );
};

export default AnswerBubble;
