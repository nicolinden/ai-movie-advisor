import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
}

export const openai = new OpenAI({
    apiKey,
});

export async function executeJsonPrompt<T>(
    prompt: string,
    schema: Record<string, unknown>,
    schemaName: string
): Promise<T> {
    const response = await openai.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt,
        text: {
            format: {
                type: 'json_schema',
                name: schemaName,
                strict: true,
                schema,
            },
        },
    });

    const outputText = response.output_text;

    if (!outputText) {
        throw new Error('OpenAI returned no output text');
    }

    return JSON.parse(outputText) as T;
}