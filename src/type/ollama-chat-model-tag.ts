interface Details {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
}

class OllamaChatModelTag {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details: Details;

    constructor(
        name: string,
        model: string,
        modified_at: string,
        size: number,
        digest: string,
        details: Details
    ) {
        this.name = name;
        this.model = model;
        this.modified_at = modified_at;
        this.size = size;
        this.digest = digest;
        this.details = details;
    }
}

class OllamaChatModelTagsResponse{
    models: OllamaChatModelTag[]
    constructor(data: OllamaChatModelTag[]) {
        this.models = data
    }
}

export {OllamaChatModelTag,OllamaChatModelTagsResponse};
