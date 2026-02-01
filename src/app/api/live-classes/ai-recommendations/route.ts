import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface TimeSlot {
    time: string;
    score: number;
    label: string;
    reason: string;
}

interface TopicSuggestion {
    topic: string;
    demand: 'high' | 'medium' | 'low';
    reason: string;
}

interface AIRecommendation {
    id: string;
    type: 'time' | 'topic' | 'engagement' | 'improvement';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionLabel: string;
}

// POST - Get AI recommendations for live classes
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, courseCategory, previousClasses, studentActivity } = body;

        // Default recommendations if AI is not configured
        const defaultTimeSlots: TimeSlot[] = [
            { time: '19:00', score: 95, label: 'Best', reason: 'Peak student activity time' },
            { time: '20:00', score: 88, label: 'Great', reason: 'High engagement period' },
            { time: '18:00', score: 75, label: 'Good', reason: 'After work/school hours' },
            { time: '21:00', score: 70, label: 'Good', reason: 'Evening learners active' },
            { time: '17:00', score: 55, label: 'Fair', reason: 'Mixed availability' },
        ];

        const defaultTopics: TopicSuggestion[] = [
            { topic: 'Redux Toolkit State Management', demand: 'high', reason: '45 students requested this topic' },
            { topic: 'React Query & Data Fetching', demand: 'high', reason: 'Trending in your course category' },
            { topic: 'Testing with Jest & RTL', demand: 'medium', reason: 'Common confusion in assignments' },
            { topic: 'Performance Optimization', demand: 'medium', reason: 'Related to recent course updates' },
        ];

        const defaultRecommendations: AIRecommendation[] = [
            {
                id: '1',
                type: 'time',
                title: 'Optimal Scheduling Time',
                description: 'Your students are most active between 7-9 PM IST. Schedule your next class during this window for 40% higher attendance.',
                impact: 'high',
                actionLabel: 'Schedule Now',
            },
            {
                id: '2',
                type: 'topic',
                title: 'Trending Topic Suggestion',
                description: 'Based on student queries, "State Management with Redux Toolkit" is highly requested. Consider a live session on this topic.',
                impact: 'high',
                actionLabel: 'Create Session',
            },
            {
                id: '3',
                type: 'engagement',
                title: 'Boost Engagement',
                description: 'Your last 3 sessions had 25% drop-off after 45 mins. Try adding interactive polls or Q&A breaks every 30 minutes.',
                impact: 'medium',
                actionLabel: 'Learn More',
            },
        ];

        // If no API key, return default recommendations
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                timeSlots: defaultTimeSlots,
                topics: defaultTopics,
                recommendations: defaultRecommendations,
                source: 'default',
            });
        }

        // Try to get AI-powered recommendations
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            if (type === 'schedule') {
                const prompt = `You are an AI assistant for an online learning platform. Based on the following context, provide scheduling recommendations for a live class:

Course Category: ${courseCategory || 'Development'}
Previous Class Performance: ${JSON.stringify(previousClasses || [])}
Student Activity Patterns: ${JSON.stringify(studentActivity || {})}

Return a JSON object with:
1. "timeSlots": Array of 5 optimal time slots with {time: "HH:MM", score: 0-100, label: "Best/Great/Good/Fair", reason: "brief explanation"}
2. "topics": Array of 4 topic suggestions with {topic: "topic name", demand: "high/medium/low", reason: "brief explanation"}
3. "recommendations": Array of 3 actionable recommendations with {id: string, type: "time/topic/engagement/improvement", title: string, description: string, impact: "high/medium/low", actionLabel: string}

Only respond with valid JSON, no additional text.`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Try to parse AI response
                try {
                    const aiData = JSON.parse(text);
                    return NextResponse.json({
                        ...aiData,
                        source: 'ai',
                    });
                } catch {
                    // If parsing fails, return defaults
                    return NextResponse.json({
                        timeSlots: defaultTimeSlots,
                        topics: defaultTopics,
                        recommendations: defaultRecommendations,
                        source: 'default',
                    });
                }
            }
        } catch (aiError) {
            console.error('AI recommendation error:', aiError);
        }

        // Fallback to defaults
        return NextResponse.json({
            timeSlots: defaultTimeSlots,
            topics: defaultTopics,
            recommendations: defaultRecommendations,
            source: 'default',
        });
    } catch (error: any) {
        console.error('Error getting AI recommendations:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
