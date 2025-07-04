import {Transition} from "solid-transition-group";
import {useChatOnlineStore} from "../../stores/chat-online-store.js";
import "./search-web-sidebar.css"

const searchWebSidebar = () => {

    const chatOnlineStore = useChatOnlineStore()

    return (
        <div class="relative">
            <Transition name="slide-right">
                {chatOnlineStore.openSidebar() && (
                    <div
                        class="fixed top-0 right-0 h-full bg-white shadow-lg p-4 transition-all duration-300 ease-in-out z-50 h-100vh overflow-y-auto"
                        style={{width: "300px"}}
                    >
                        <h2 class="text-lg font-bold mb-2">联网搜索结果</h2>
                        <ul class="space-y-1">
                            {chatOnlineStore?.webPageInfo()?.map((item) => (
                                <>
                                    <div class="divider"/>
                                    <li class="text-sm text-gray-800">
                                        <div>
                                            <div class='flex flex-nowrap items-center'>
                                                <img src={item.icon} alt={item.web_anchor}
                                                     class='rounded-lg size-5 b-solid border border-gray-200 border-solid mr-2'/>
                                                {item.web_anchor}
                                            </div>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                <div class='font-bold text-base mt-1 mb-1 hover:text-blue-400'>
                                                    {item.title}
                                                </div>
                                            </a>

                                        </div>
                                        <div>
                                            {item.content}
                                        </div>
                                        <p class="text-sm text-gray-400">
                                            {item.date}
                                        </p>
                                    </li>
                                </>
                            ))}
                        </ul>
                    </div>
                )}
            </Transition>
        </div>
    );
};

export default searchWebSidebar;
