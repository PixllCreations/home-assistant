# JARVIS Assistant

A local AI voice assistant inspired by J.A.R.V.I.S., powered by OpenAI, ElevenLabs, Whisper, and wake-word detection.

## Features
- GPT-4o for responses
- ElevenLabs text-to-speech
- Whisper for speech-to-text
- Porcupine wake-word detection
- TypeScript + Node.js

## Getting Started

1. Copy `.env.example` to `.env` and fill in your API keys.
2. Run `pnpm install`
3. Start the assistant with `pnpm dev`

## Requirements

- Node.js 20+
- `sox` installed for audio capture
- Whisper binary (`main`) in your PATH