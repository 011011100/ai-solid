import {BASE_URL} from "../config/config.js";

export const deepseekApi =  () => {

    const getAllChatModel = (() => {
        return `${BASE_URL}getAllDeepSeekChatModel`;
    })

    return {
        getAllChatModel,
    }
}

