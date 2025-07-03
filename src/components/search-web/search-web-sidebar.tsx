import { Transition } from "solid-transition-group";
import {useChatOnlineStore} from "../../stores/chat-online-store.js";
import "./search-web-sidebar.css"

const searchWebSidebar = () => {

    const chatOnlineStore = useChatOnlineStore()

    return (
        <div class="relative">
            <Transition name="slide-right">
                {chatOnlineStore.webPageInfo() && (
                    <div
                        class="fixed top-0 right-0 h-full bg-white shadow-lg p-4 transition-all duration-300 ease-in-out z-50"
                        style={{ width: "300px" }}
                    >
                        <h2 class="text-lg font-bold mb-2">联网搜索结果</h2>
                        <ul class="space-y-1">
                            {chatOnlineStore?.webPageInfo()?.map((item) => (
                                <li class="text-sm text-gray-800">
                                    {item.id}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Transition>
        </div>
    );
};

export default searchWebSidebar;
