type StreamFetcherOptions = {
    url: string;
    body?: any;
    connectionTimeout?: number; // ms, -1 表示不设置
    heartbeatTimeout?: number;  // ms, -1 表示不设置
    onData?: (data: any) => void;
    onComplete?: () => void;
    onError?: (err: any) => void;
};

/**
 * 启动 WebFlux 流式请求，返回用于停止流的函数
 */
export function startStream(options: StreamFetcherOptions): () => void {
    const {
        url,
        body,
        connectionTimeout,
        heartbeatTimeout,
        onData,
        onComplete,
        onError
    } = options;

    let controller = new AbortController();
    let heartbeatTimer: ReturnType<typeof setTimeout> | null = null;
    let connectionTimer: ReturnType<typeof setTimeout> | null = null;

    const resetHeartbeat = () => {
        if (heartbeatTimeout != null && heartbeatTimeout > 0) {
            if (heartbeatTimer) clearTimeout(heartbeatTimer);
            heartbeatTimer = setTimeout(() => {
                controller.abort();
                onError?.(new Error("Heartbeat timeout"));
            }, heartbeatTimeout);
        }
    };

    const cleanup = () => {
        controller.abort();
        if (heartbeatTimer) clearTimeout(heartbeatTimer);
        if (connectionTimer) clearTimeout(connectionTimer);
    };

    const run = async () => {
        try {
            if (connectionTimeout != null && connectionTimeout > 0) {
                connectionTimer = setTimeout(() => {
                    controller.abort();
                    onError?.(new Error("Connection timeout"));
                }, connectionTimeout);
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/stream+json"
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            resetHeartbeat();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                resetHeartbeat();
                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const parsed = JSON.parse(line);
                            onData?.(parsed);
                        } catch (err) {
                            console.warn("Invalid JSON line:", line);
                        }
                    }
                }
            }

            onComplete?.();
        } catch (err) {
            if ((err as any).name !== "AbortError") {
                onError?.(err);
            }
        } finally {
            cleanup();
        }
    };

    run();

    return () => {
        cleanup();
    };
}
