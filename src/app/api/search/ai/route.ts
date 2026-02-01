import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { generateEmbedding } from '@/lib/gemini';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
        }

        // 1. Generate embedding for user query
        const queryVector = await generateEmbedding(query);

        if (!queryVector || queryVector.length === 0) {
            return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 });
        }

        await connectDB();

        // 2. Perform Vector Search (assuming Index is created in Atlas)
        // Note: Atlas Vector Search uses aggregation pipeline
        // This is a standard vector search aggregation for MongoDB Atlas
        const results = await Course.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index", // Name of your index in Atlas
                    path: "embedding",
                    queryVector: queryVector,
                    numCandidates: 100,
                    limit: 10
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    category: 1,
                    instructor: 1,
                    price: 1,
                    rating: 1,
                    score: { $meta: "vectorSearchScore" } // Include match score
                }
            }
        ]);

        // Fallback if no vector search index (for local testing without Atlas Search setup)
        // In production, you MUST set up the index. This fallback is just to prevent crashing.
        if (results.length === 0) {
            // Just return text search results as fallback
            const textResults = await Course.find({
                $text: { $search: query }
            }).limit(10);
            return NextResponse.json(textResults);
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
