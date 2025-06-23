import {createEffect, createRoot, createSignal} from "solid-js";
import {useEventSource} from "../utils/use-event-source.js";
import {ollamaApi} from "../api/ollama-api.js";
import {type OllamaChatModelTag, OllamaChatModelTagsResponse} from "../type/ollama-chat-model-tag.js";
// import {deepseekApi} from "../api/deepseek-api.js";
// import {DeepseekChatModelTag, type DeepseekChatModelTagsResponse} from "../type/deepseek-chat-model-tag.js";

let store: ReturnType<typeof createChatModelStore>;

function createChatModelStore() {
    const [modelNameList, setModelNameList] = createSignal<string[]>([]);
    const [modelList, setModelList] = createSignal<OllamaChatModelTag[]>([]);
    // const [modelList, setModelList] = createSignal<DeepseekChatModelTag[]>([]);

    function getAllModelName() {
        setModelNameList([]);
        let {data} = useEventSource<OllamaChatModelTagsResponse>(ollamaApi().getAllChatModel())
        // let {data} = useEventSource<DeepseekChatModelTagsResponse>(deepseekApi().getAllChatModel())
        createRoot(() => {
            createEffect(() => {
                // let d = data()?.data;
                let d = data()?.models;
                if (d) {
                    setModelList([...d]);
                    // setModelNameList(d.map((item) => item.id));
                    setModelNameList(d.map((item) => item.name));
                }
            })
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
