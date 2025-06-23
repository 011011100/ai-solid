import {BASE_URL} from "../config/config.js";

export const defaultChatApi = () => {

    const askQuestionApi = ((question: string, conversationId: string, modelName: string): string => {
        return `${BASE_URL}askQuestion?question=${question}&conversationId=${conversationId}&modelName=${modelName}`;
    })

    const getHistoryMessageApi = ((conversationId: string): string => {
        return `${BASE_URL}getHistoryMessage?conversationId=${conversationId}`;
    })

    const getHistoryConversationApi = (): string => {
        return `${BASE_URL}getHistoryConversation`;
    }

    const createTitleApi = ((question: string, conversationId: string, modelName: string): string => {
        return `${BASE_URL}createTitle?question=${question}&conversationId=${conversationId}&modelName=${modelName}`;
    })

    return {
        askQuestionApi,
        getHistoryMessageApi,
        getHistoryConversationApi,
        createTitleApi,
    }
}
