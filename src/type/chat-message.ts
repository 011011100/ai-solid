class ChatMessage {
    public messageType : 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL'
    public metadata: any
    public media: Array<any>
    public text: string
    public toolCalls?: Array<any>
    constructor(data: ChatMessage) {
        this.messageType = data.messageType
        this.metadata = data.metadata
        this.media = data.media;
        this.text = data.text
        this.toolCalls = data.toolCalls
    }
}

export default ChatMessage
