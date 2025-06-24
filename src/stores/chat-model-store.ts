import {createSignal} from "solid-js";
import {useEventSource} from "../utils/use-event-source.js";
import {getAllDeepSeekChatModel} from "../api/deepseek-api.js";
import {DeepseekChatModelTag, type DeepseekChatModelTagsResponse} from "../type/deepseek-chat-model-tag.js";

let store: ReturnType<typeof createChatModelStore>;

function createChatModelStore() {
    const [modelNameList, setModelNameList] = createSignal<string[]>();
    const [modelList, setModelList] = createSignal<DeepseekChatModelTag[]>([]);

    function getAllModelName() {
        setModelNameList([]);
        useEventSource<DeepseekChatModelTagsResponse>(getAllDeepSeekChatModel(),{
            onMessage: (data) => {
                let d = data?.data;
                setModelList([...d]);
                setModelNameList(d.map((item) => item.id));
            }
        })
    }

    const [model, setModel] = createSignal<string>('');

    function setModelName(name: string) {
        setModel(name);
    }

    return {
        modelList,
        modelNameList,
        getAllModelName,
        model,
        setModelName,
    };
}

export function useChatModelStore() {
    if (!store) store = createChatModelStore();
    return store;
}
