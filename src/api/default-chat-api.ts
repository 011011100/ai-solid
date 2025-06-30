import {BASE_URL} from "../config/config.js";

const askQuestionApi = ((question: string, conversationId: string, modelName: string,onlineSearch?:string): string => {
    return `${BASE_URL}askQuestion?question=${question}&conversationId=${conversationId}&modelName=${modelName}&onlineSearch=${onlineSearch}`;
})

const askQuestionApi2 = ((): string => {
    return `${BASE_URL}askQuestion`;
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

const changeTitleApi = ((title: string, conversationId: string): string => {
    return `${BASE_URL}changeTitle?title=${title}&conversationId=${conversationId}`;
})

const deleteQuestionApi = ((conversationId: string): string => {
    return `${BASE_URL}deleteQuestion?conversationId=${conversationId}`;
})

const clearErrorDataApi = ((conversationId: string): string => {
    return `${BASE_URL}clearErrorData?conversationId=${conversationId}`;
})

const onlineSearchApi = ((question: string): string => {
    return `${BASE_URL}onlineSearch?question=${question}`;
})

export {
    askQuestionApi,
    askQuestionApi2,
    getHistoryMessageApi,
    getHistoryConversationApi,
    createTitleApi,
    changeTitleApi,
    deleteQuestionApi,
    clearErrorDataApi,
    onlineSearchApi,
}
