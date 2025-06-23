import {onMount, type Component} from "solid-js";
import {useChatModelStore} from "../../stores/chat-model-store.js";

const chooseModel: Component = () => {

    const chatModelStore = useChatModelStore();

    onMount(() => {
        chatModelStore.getAllModelName();
    })

    return (
        <div class="dropdown dropdown-end z-10">
            <p class="label mr-1">选择模型</p>
            <div tabIndex={0} role="button" class="m-1 text-lg ">
                {chatModelStore.model() || "选择模型"}
            </div>
            <ul tabIndex={0}
                class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                {
                    chatModelStore.modelNameList().map(name => {
                        return <li>
                            <a onClick={() => chatModelStore.setModelName(name)}>
                                {name}
                            </a>
                        </li>
                    })
                }
            </ul>
        </div>
    )
}

export default chooseModel
