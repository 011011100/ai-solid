import { createContext, useContext,type JSX } from "solid-js";
import { createSignal } from "solid-js";
import {setGlobalNotify} from "./global-notifier.ts";
// @ts-ignore
import { Motion } from "@motionone/solid";

type Notification = {
    id: number;
    message: string;
    type?: "success" | "error" | "warning" | "info";
};

type NotificationContextType = {
    notify: (message: string, type?: Notification["type"]) => void;
};

const NotificationContext = createContext<NotificationContextType>();

let idCounter = 0;

export function NotificationProvider(props: { children: JSX.Element }) {
    const [notifications, setNotifications] = createSignal<Notification[]>([]);

    const notify = (message: string, type?: Notification["type"]) => {
        const id = ++idCounter;
        setNotifications((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
    };

    setGlobalNotify(notify);

    return (
        <NotificationContext.Provider value={{ notify }}>
            {props.children}
            <div class="fixed top-4 left-[50%] z-50 space-y-2">
                {notifications().map((n) => (
                    <Motion.div
                        initial={{ opacity: 0, transform: "translateY(-20px)" }}
                        animate={{ opacity: 1, transform: "translateY(0%)" }}
                        exit={{ opacity: 0, transform: "translateY(-20%)" }}
                        transition={{ duration: 0.3 }}
                        class={`p-3 rounded shadow transition-all ${
                            n.type === "success"
                                ? "bg-green-100 text-green-700"
                                : n.type === "error"
                                    ? "bg-red-100 text-red-700"
                                    : n.type === "warning"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-blue-100 text-blue-700"
                        }`}
                    >
                        {n.message}
                    </Motion.div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotifier() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifier must be used within NotificationProvider");
    }
    return context.notify;
}
