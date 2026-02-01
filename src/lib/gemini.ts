import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyCDANgmy1pvkxHT-apO1lEsFg2Lu22FU2o";

if (!apiKey) {
    console.warn('Missing GOOGLE_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        if (!apiKey) {
            throw new Error('Google API Key not configured');
        }

        // Clean text to avoid issues
        const cleanText = text.replace(/\n/g, ' ').trim();

        if (!cleanText) return [];

        const result = await model.embedContent(cleanText);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error('Error generating embedding:', error);
        return []; // Return empty array on failure
    }
}

export async function generateContentSummary(text: string): Promise<string> {
    try {
        if (!apiKey) return '';

        const summaryModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `Summarize the following course content in a concise, engaging paragraph suitable for course recommendations: \n\n${text}`;

        const result = await summaryModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating summary:', error);
        return '';
    }
}
