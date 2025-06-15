import "dotenv/config";

export const config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY!,
  ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID!,
  JARVIS_MODE: true,
};
