// src/utils/useEventSource.ts
import { createSignal, onCleanup } from "solid-js";

export function useEventSource<T = any>(url: string) {
    const [data, setData] = createSignal<T | null>(null);
    const [error, setError] = createSignal<Event | null>(null);
    const [isOpen, setIsOpen] = createSignal(false);

    let lastUpdate = Date.now();

    let eventSource: EventSource | null = new EventSource(url);

    eventSource.onopen = () => {
        setIsOpen(true);
    };

    eventSource.onmessage = (e) => {
        lastUpdate = Date.now();
        try {
            setData(JSON.parse(e.data));
        } catch {
            setData(e.data);
        }
    };

    eventSource.onerror = (e) => {
        setError(e);
        setIsOpen(false);
        eventSource?.close(); // 可根据需求选择是否自动关闭
        clearInterval(heartbeat);
    };

    const heartbeat = setInterval(() => {
        const now = Date.now();
        if (now - lastUpdate > 10_000) { // 超过10秒未收到数据
            console.warn("检测到流可能已停止");
            eventSource?.close();
            clearInterval(heartbeat);
        }
    }, 1000);

    onCleanup(() => {
        eventSource?.close();
        clearInterval(heartbeat);
    });

    const stop = () => {
        eventSource?.close();
        eventSource = null;
        setIsOpen(false);
    };

    return {
        data,
        error,
        isOpen,
        stop,
    };
}
