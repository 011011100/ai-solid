type NotifyType = "success" | "error" | "warning" | "info";
type NotifyFunction = (msg: string, type?: NotifyType) => void;

let globalNotify: NotifyFunction | null = null;

export function setGlobalNotify(fn: NotifyFunction) {
    globalNotify = fn;
}

export function notify(msg: string, type: NotifyType = "info") {
    if (globalNotify) {
        globalNotify(msg, type);
    } else {
        console.warn("Global notify not set:", msg);
    }
}
