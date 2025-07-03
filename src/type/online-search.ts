interface Message {
    content: string;
    role: 'assistant' | 'user';
}

interface Choice {
    finish_reason: string;
    index: number;
    message: Message;
}

interface Reference {
    content: string;
    date: string;
    icon: string | null;
    id: number;
    image: string | null;
    title: string;
    type: string;
    url: string;
    video: string | null;
    web_anchor: string;
}

interface Usage {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
}

class TyphoonResponse {
    choices: Choice[];
    references: Reference[];
    request_id: string;
    safe_classification: string;
    usage: Usage;
    _safe: boolean;

    constructor(data : TyphoonResponse) {
        this.choices = data.choices
        this.references = data.references
        this.request_id = data.request_id
        this.safe_classification = data.safe_classification
        this.usage = data.usage
        this._safe = data._safe
    }
}

export default TyphoonResponse
