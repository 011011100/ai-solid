/* @refresh reload */
import {render} from 'solid-js/web'
import {Route, Router} from "@solidjs/router";
import App from "./app.tsx";
import "./index.css";
import Chat from "./pages/chat.tsx";
import Layout from "./layout/layout.js";
import {NotificationProvider} from "./components/notification-context/notificatio-context.js";
import CustomContextMenu from "./components/menu/custom-context-menu.js";
import {useContextMenuStore} from "./stores/context-menu-store.js";
import {onMount} from "solid-js";

const contextMenuStore = useContextMenuStore();
onMount(() => {
    // 点击页面隐藏菜单
    document.addEventListener('click', () => {
        contextMenuStore.setMenuVisible(false);
    });

    // 右键菜单监听
    document.addEventListener('contextmenu', (e) => {
        const text = window.getSelection()?.toString().trim();
        if (text) {
            e.preventDefault();
            contextMenuStore.showCustomMenu(e.pageX, e.pageY, text);
        }
    });
});


render(
    () => (
        <NotificationProvider>
            <CustomContextMenu/>
            <Layout>
                <Router>
                    <Route path="/Chat" component={Chat}/>
                    <Route path="/" component={App}/>
                </Router>
            </Layout>
        </NotificationProvider>
    ),
    document.getElementById('root')!
)
