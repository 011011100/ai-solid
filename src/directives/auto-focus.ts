export function autoFocus(el: HTMLElement) {
    queueMicrotask(() => el.focus());
}