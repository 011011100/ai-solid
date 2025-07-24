import {useContextMenuStore} from "../../stores/context-menu-store.js";

const contextMenuStore = useContextMenuStore();

function search(engine: 'google' | 'bing' | 'baidu') {
    const q = encodeURIComponent(contextMenuStore.selectedText());
    let url = '';
    switch (engine) {
        case 'google':
            url = `https://www.google.com/search?q=${q}`;
            break;
        case 'bing':
            url = `https://www.bing.com/search?q=${q}`;
            break;
        case 'baidu':
            url = `https://www.baidu.com/s?wd=${q}`;
            break;
    }
    window.open(url, '_blank');
    contextMenuStore.setMenuVisible(false);
}

export default function CustomContextMenu() {
    return (
        <>
            {contextMenuStore.menuVisible() && (
                <div
                    class='p-2 z-1000 border-solid border-1 border-gray-300 bg-gray-50 absolute rounded-lg'
                    style={{
                        top: `${contextMenuStore.menuPosition().y}px`, // ✅ 鼠标Y位置
                        left: `${contextMenuStore.menuPosition().x}px`, // ✅ 鼠标X位置
                    }}
                >
                    <div onClick={() => search('google')}>🔍 用 Google 搜索</div>
                    <hr/>
                    <div onClick={() => search('bing')}>🔍 用 Bing 搜索</div>
                    <hr/>
                    <div onClick={() => search('baidu')}>🔍 用 百度 搜索</div>
                </div>
            )}
        </>
    );
}
