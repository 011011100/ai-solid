const BASE_URL = 'http://localhost:8080/'

const askQuestionApi = ((question: string , conversationId: string): string => {
    return `${BASE_URL}askQuestion?question=${question}&conversationId=${conversationId}`;
})


const getHistoryMessageApi = ((conversationId: string): string => {
    return `${BASE_URL}getHistoryMessage?conversationId=${conversationId}`;
})

const getHistoryConversationIdApi = (): string => {
    return `${BASE_URL}getHistoryConversationId`;
}

export {
    askQuestionApi,
    getHistoryMessageApi,
    getHistoryConversationIdApi
};
