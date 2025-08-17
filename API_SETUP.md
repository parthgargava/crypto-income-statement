# API Setup Guide

## Setting up Gemini API Key

To use the AI-powered transaction categorization feature, you need to set up a Google AI (Gemini) API key.

### Step 1: Get your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with the following content:

```bash
# Google AI (Gemini) API Key
GOOGLE_AI_API_KEY=your_actual_api_key_here

# Optional: Set the model (default is gemini-2.0-flash)
GOOGLE_AI_MODEL=googleai/gemini-2.0-flash
```

### Step 3: Restart Development Server

After creating the `.env.local` file, restart your development server:

```bash
npm run dev
```

### Fallback Mode

If no API key is configured, the application will automatically use mock data for demonstration purposes. You'll see a warning in the console, but the app will continue to work.

### Troubleshooting

- **"API key not configured" error**: Make sure your `.env.local` file is in the project root and contains the correct API key
- **"Invalid API key" error**: Verify your API key is correct and has the necessary permissions
- **Rate limiting**: The free tier has usage limits. Consider upgrading if you hit limits

### Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore` to prevent accidental commits
- Keep your API key secure and don't share it publicly
