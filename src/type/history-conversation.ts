class HistoryConversation {
    public conversationId: string;
    public problemSummary: string;

    constructor(data:HistoryConversation) {
        this.problemSummary = data.problemSummary
        this.conversationId = data.conversationId
    }
}

export default HistoryConversation
