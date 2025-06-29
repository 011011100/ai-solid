export interface NewsResponse {
    choices: Choice[];
    is_safe: boolean;
    references: Reference[];
    request_id: string;
    safe_classification: string;
    usage: Usage;
}

export interface Choice {
    finish_reason: string;
    index: number;
    message: Message;
}

export interface Message {
    content: string;
    role: string;
}

export interface Reference {
    content: string;
    date: string;
    icon: string;
    id: number;
    image: string | null;
    title: string;
    type: string;
    url: string;
    video: string | null;
    web_anchor: string;
}

export interface Usage {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
}
