// 定义元数据类型
interface RateLimit {
    requestsRemaining: number;
    tokensReset: string;
    requestsLimit: number;
    tokensLimit: number;
    tokensRemaining: number;
    requestsReset: string;
}

interface Usage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

interface Metadata {
    id: string;
    model: string;
    rateLimit: RateLimit;
    usage: Usage;
    promptMetadata: any[]; // 如果结构已知可以更详细定义
    empty: boolean;
}

// 定义结果中的消息结构
interface MessageMetadata {
    messageType: string;
}

interface Output {
    messageType: string;
    metadata: MessageMetadata;
    toolCalls: any[]; // 若结构已知可细化
    media: any[];     // 若结构已知可细化
    text: string;
}

interface ResultMetadata {
    finishReason: string;
    contentFilters: any[]; // 若结构已知可细化
    empty: boolean;
}

interface Result {
    metadata: ResultMetadata;
    output: Output;
}

// 定义整个 JSON 数据结构
interface BackendResponse {
    result: Result;
    metadata: Metadata;
    results: Result[];
}

// 类封装
class ResponseParser {
    public result: Result;
    public metadata: Metadata;
    public results: Result[];

    constructor(data: BackendResponse) {
        this.result = data.result;
        this.metadata = data.metadata;
        this.results = data.results;
    }

    getText(): string {
        return this.result.output.text;
    }

    isEmpty(): boolean {
        return this.result.metadata.empty || this.result.output.text === "";
    }

    getModel(): string {
        return this.metadata.model;
    }

    getTotalTokens(): number {
        return this.metadata.usage.totalTokens;
    }
}

export { ResponseParser };
