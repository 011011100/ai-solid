// src/utils/useEventSource.ts
import {createRoot, createSignal, onCleanup} from "solid-js";

interface UseEventSourceOptions<T = any> {
    connectTimeout?: number;   // 毫秒，连接建立最大等待时间，-1 表示禁用
    idleTimeout?: number;      // 毫秒，连接建立后最大静默时间，-1 表示禁用
    onMessage?: (data: T) => void; // ✅ 新增：接收到消息时触发的回调
}

export function useEventSource<T = any>(url: string, options?: UseEventSourceOptions<T>) {
    const [data, setData] = createSignal<T | null>(null);
    const [error, setError] = createSignal<Event | null>(null);
    const [isOpen, setIsOpen] = createSignal(false);

    const connectTimeoutMs = options?.connectTimeout ?? 50000;
    const idleTimeoutMs = options?.idleTimeout ?? 10000;

    let lastUpdate = Date.now();
    let eventSource: EventSource | null = new EventSource(url);

    let heartbeat: number | undefined;
    let connectTimeout: number | undefined;

    if (connectTimeoutMs !== -1) {
        connectTimeout = window.setTimeout(() => {
            if (!isOpen()) {
                console.warn("连接超时");
                setError(new Event("timeout"));
                eventSource?.close();
                eventSource = null;
                clearInterval(heartbeat);
            }
        }, connectTimeoutMs);
    }

    eventSource.onopen = () => {
        if (connectTimeout !== undefined) clearTimeout(connectTimeout);
        setIsOpen(true);
    };

    eventSource.onmessage = (e) => {
        lastUpdate = Date.now();
        let parsed;

        try {
            parsed = JSON.parse(e.data);
        } catch {
            parsed = e.data;
        }
        setData(parsed);
        // ✅ 调用用户自定义的回调
        options?.onMessage?.(parsed as T);
    };

    eventSource.onerror = (e) => {
        setError(e);
        setIsOpen(false);
        eventSource?.close();
        clearInterval(heartbeat);
        if (connectTimeout !== undefined) clearTimeout(connectTimeout);
    };

    if (idleTimeoutMs !== -1) {
        heartbeat = window.setInterval(() => {
            const now = Date.now();
            if (now - lastUpdate > idleTimeoutMs) {
                console.warn("检测到流可能已停止");
                eventSource?.close();
                eventSource = null;
                clearInterval(heartbeat);
                setIsOpen(false);
            }
        }, 1000);
    }

    createRoot(() => {
        onCleanup(() => {
            eventSource?.close();
            eventSource = null;
            if (heartbeat !== undefined) clearInterval(heartbeat);
            if (connectTimeout !== undefined) clearTimeout(connectTimeout);
        });
    });

    const stop = () => {
        eventSource?.close();
        eventSource = null;
        if (heartbeat !== undefined) clearInterval(heartbeat);
        if (connectTimeout !== undefined) clearTimeout(connectTimeout);
        setIsOpen(false);
    };

    return {
        data,
        error,
        isOpen,
        stop,
    };
}
