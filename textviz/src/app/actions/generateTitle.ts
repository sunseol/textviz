'use server';

import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export async function generateTitle(content: string) {
    if (!content || content.trim().length < 10) {
        return null;
    }

    // Truncate content to avoid token limits for title generation (first 2000 chars is plenty)
    const truncatedContent = content.slice(0, 2000);

    try {
        const { text } = await generateText({
            model: groq('llama-3.1-8b-instant'),
            system: `You are a helpful assistant that generates concise titles for documents.
      Rules:
      1. Create a short, descriptive title (3-6 words).
      2. If the content is in Korean, the title MUST be in Korean.
      3. If the content is in English, the title MUST be in English.
      4. Do NOT use quotes or special characters unless necessary.
      5. Output ONLY the title text.`,
            prompt: `Content:\n${truncatedContent}\n\nTitle:`,
            maxTokens: 50,
            temperature: 0.5,
        });

        return text.trim();
    } catch (error) {
        console.error('Error generating title:', error);
        return null;
    }
}
