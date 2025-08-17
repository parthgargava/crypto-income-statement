import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if API key is available
const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  GOOGLE_AI_API_KEY not found in environment variables.');
  console.warn('Please set your Gemini API key in a .env.local file:');
  console.warn('GOOGLE_AI_API_KEY=your_api_key_here');
  console.warn('Get your API key from: https://makersuite.google.com/app/apikey');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || 'dummy-key-for-development',
    }),
  ],
  model: process.env.GOOGLE_AI_MODEL || 'googleai/gemini-2.0-flash',
});
