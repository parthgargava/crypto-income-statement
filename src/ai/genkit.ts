import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if API keys are available
const geminiApiKey = process.env.GOOGLE_AI_API_KEY;
const grokApiKey = process.env.GROK_API_KEY;

if (!geminiApiKey && !grokApiKey) {
  console.warn('⚠️  No AI API keys found in environment variables.');
  console.warn('Please set either GOOGLE_AI_API_KEY or GROK_API_KEY in a .env.local file:');
  console.warn('GOOGLE_AI_API_KEY=your_gemini_key_here');
  console.warn('GROK_API_KEY=your_grok_key_here');
  console.warn('Get Gemini API key from: https://makersuite.google.com/app/apikey');
  console.warn('Get Grok API key from: https://console.x.ai/');
}

// For now, only use Gemini since Grok plugin isn't available
const useGemini = !!geminiApiKey;

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey || 'dummy-key-for-development',
    }),
  ],
  model: process.env.GOOGLE_AI_MODEL || 'googleai/gemini-2.0-flash',
});

// Export AI provider info for debugging
export const aiConfig = {
  provider: 'Gemini',
  model: process.env.GOOGLE_AI_MODEL || 'googleai/gemini-2.0-flash',
  hasApiKey: !!geminiApiKey,
};
