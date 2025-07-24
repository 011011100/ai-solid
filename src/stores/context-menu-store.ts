import {createSignal} from "solid-js";

let store: ReturnType<typeof createContextMenuStore>;

function createContextMenuStore() {

    // 控制是否显示菜单
    const [menuVisible, setMenuVisible] = createSignal(false);

    // 存储菜单位置
    const [menuPosition, setMenuPosition] = createSignal({ x: 0, y: 0 });

    // 存储选中的文本
    const [selectedText, setSelectedText] = createSignal('');

    // 显示菜单的函数
    function showCustomMenu(x: number, y: number, text: string) {
        setMenuPosition({ x, y });
        setSelectedText(text);
        setMenuVisible(true);
    }

    // 隐藏菜单
    function hideCustomMenu() {
        setMenuVisible(false);
    }


    return {
        menuVisible,
        setMenuVisible,
        menuPosition,
        setMenuPosition,
        selectedText,
        setSelectedText,
        showCustomMenu,
        hideCustomMenu,
    }
}

export function useContextMenuStore() {
    if (!store) store = createContextMenuStore();
    return store;
}
