class ChatBubble {
    public type: 'ask' | 'answer';
    public message: string;

    constructor(data: ChatBubble) {
        this.type = data.type;
        this.message = data.message;
    }
}

export {ChatBubble}
