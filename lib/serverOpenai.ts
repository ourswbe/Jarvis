import OpenAI from 'openai';

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing API key');
  }

  return new OpenAI({ apiKey });
}
