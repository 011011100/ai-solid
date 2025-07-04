import {useEventSource} from "../utils/use-event-source.js";
import type {NewsResponse, Reference} from "../type/online-response.js";
import {onlineSearchApi} from "../api/default-chat-api.js";
import {createSignal} from "solid-js";

let store: ReturnType<typeof createChatOnlineStore>;

function createChatOnlineStore() {

    const [onlineSearch, setOnlineSearch] = createSignal<string>()

    const [webPageInfo,setWebPageInfo] = createSignal<Reference[]>()

    const [openSidebar,setOpenSidebar] = createSignal<boolean>(false)

    function doOnlineSearch(q: string): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            clearInfo()
            useEventSource<NewsResponse>(onlineSearchApi(q), {
                connectTimeout: -1,
                idleTimeout: -1,
                onMessage: (data) => {
                    // 你可以在这里处理 data
                    console.log("联网数据", data)
                    setOnlineSearch(data.choices[0].message.content)
                    setWebPageInfo(data.references)
                    setOpenSidebar(true)
                    // ✅ 根据某种结束条件判断搜索已完成
                    resolve()
                },
                onError: () => {
                    console.error("查询失败")
                    reject()
                }
            })
        })
    }

    function clearInfo(){
        setOpenSidebar(false)
        setWebPageInfo([])
    }


    return {
        openSidebar,
        setOpenSidebar,
        webPageInfo,
        onlineSearch,
        doOnlineSearch,
        clearInfo,
    }
}

export function useChatOnlineStore() {
    if (!store) store = createChatOnlineStore();
    return store;
}