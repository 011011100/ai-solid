const BASE_URL = 'http://localhost:8080/chat/'

const askQuestionApi = ((question: string, conversationId: string, modelName: string): string => {
    return `${BASE_URL}askQuestion?question=${question}&conversationId=${conversationId}&modelName=${modelName}`;
})


const getHistoryMessageApi = ((conversationId: string): string => {
    return `${BASE_URL}getHistoryMessage?conversationId=${conversationId}`;
})

const getHistoryConversationApi = (): string => {
    return `${BASE_URL}getHistoryConversation`;
}

const createTitleApi = ((question: string , conversationId: string): string => {
    return `${BASE_URL}createTitle?question=${question}&conversationId=${conversationId}`;
const createTitleApi = ((question: string, conversationId: string, modelName: string): string => {
    return `${BASE_URL}createTitle?question=${question}&conversationId=${conversationId}&modelName=${modelName}`;
})

})

export {
    askQuestionApi,
    getHistoryMessageApi,
    getHistoryConversationApi,
    createTitleApi,
};
