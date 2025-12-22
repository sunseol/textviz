import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { buildSystemPrompt } from '@/lib/ai/contextBuilder';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, userProfile, currentContext } = await req.json();

    // Build the dynamic system prompt based on context
    const systemPrompt = buildSystemPrompt(userProfile, currentContext);

    const result = streamText({
        model: groq('moonshotai/kimi-k2-instruct-0905'), // Updated as per user request
        system: systemPrompt,
        messages,
        temperature: 0.7,
        maxTokens: 1024,
    });

    return result.toDataStreamResponse();
}
