import { pipeline, env } from '@xenova/transformers';

// Configure environment to ensure models are downloaded from HuggingFace and cached locally in browser Cache API
env.allowLocalModels = false;
env.useBrowserCache = true;

class EmbeddingPipeline {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            // Load the NLP model once and store it in memory for instant reuse
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

/**
 * Generate highly semantic 384-dimensional embeddings for text via local BERT
 * @param {string} text 
 * @returns {Promise<number[]>} array of numbers
 */
export async function generateEmbedding(text) {
    if (!text) return Array.from({ length: 384 }, () => 0);
    try {
        const extractor = await EmbeddingPipeline.getInstance();
        // Generate embeddings with pooling='mean' and normalized=true for cosine similarity optimization
        const output = await extractor(text, { pooling: 'mean', normalize: true });
        
        // Output from Xenova is a Tensor. Extract the pure vector array.
        const vectorArray = Array.from(output.data);
        return vectorArray;
    } catch (err) {
        console.error("Failed to generate real BERT embedding, falling back to mock: ", err);
        return Array.from({ length: 384 }, () => Math.random());
    }
}
