class DeepseekChatModelTag {
    id: string;
    object: string;
    modified_at: string;

    constructor(
        id: string,
        object: string,
        modified_at: string,
    ) {
        this.id = id;
        this.object = object;
        this.modified_at = modified_at;
    }
}

class DeepseekChatModelTagsResponse {
    data: DeepseekChatModelTag[]
    object: string
    constructor(data: DeepseekChatModelTag[],object: string) {
        this.data = data
        this.object = object
    }
}

export {DeepseekChatModelTag,DeepseekChatModelTagsResponse};
