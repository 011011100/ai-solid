import type MarkdownIt from 'markdown-it';
import katex from 'katex';

export function addSafeInlineMath(md: MarkdownIt) {
    md.inline.ruler.after('escape', 'custom_math_inline', (state, silent) => {
        const start = state.pos;
        const marker = state.src.charCodeAt(start);

        if (marker !== 0x24 /* $ */) return false;

        let match = start + 1;
        while (match < state.src.length && state.src.charCodeAt(match) !== 0x24) {
            match++;
        }

        if (match >= state.src.length) return false; // 找不到闭合符号

        const content = state.src.slice(start + 1, match).trim();
        if (!content) return false; // 空内容不渲染

        if (!silent) {
            const token = state.push('math_inline', 'math', 0);
            token.content = content;
            token.markup = '$';
        }

        state.pos = match + 1;
        return true;
    });

    // 渲染器处理
    md.renderer.rules.math_inline = (tokens, idx) => {
        try {
            return katex.renderToString(tokens[idx].content, {
                throwOnError: false,
            });
        } catch (err) {
            return tokens[idx].content;
        }
    };

    // 块级公式渲染器（$$...$$）
    md.block.ruler.after('blockquote', 'math_block', (state, startLine, endLine, silent) => {
        const start = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const firstLine = state.src.slice(start, max);

        if (!firstLine.startsWith('$$')) return false;

        let content = '', nextLine = startLine + 1;
        const closeTag = firstLine.trim().endsWith('$$') && firstLine.trim() !== '$$';
        if (closeTag) {
            content = firstLine.trim().slice(2, -2).trim();
        } else {
            for (; nextLine < endLine; nextLine++) {
                const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
                const lineEnd = state.eMarks[nextLine];
                const line = state.src.slice(lineStart, lineEnd);
                if (line.trim().endsWith('$$')) {
                    content += '\n' + line.trim().slice(0, -2);
                    break;
                }
                content += '\n' + line;
            }
        }

        if (silent) return true;

        const token = state.push('math_block', 'math', 0);
        token.block = true;
        token.content = content;
        token.map = [startLine, nextLine + 1];
        token.markup = '$$';
        state.line = nextLine + 1;
        return true;
    });

    // 块级公式渲染器
    md.renderer.rules.math_block = (tokens, idx) => {
        try {
            const formula = cleanLatexBlock(tokens[idx].content);
            return `<p class="katex-block">${katex.renderToString(formula, {
                throwOnError: false,
                displayMode: true,
            })}</p>`;
        } catch (err) {
            return `<pre>${tokens[idx].content}</pre>`;
        }
    };

    // 清理 block 公式内的换行和缩进
    function cleanLatexBlock(content: string): string {
        return content.trim().replace(/\s*\n\s*/g, ' ');
    }

}
