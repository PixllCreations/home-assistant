// src/core/voice/VoiceResponder.ts
import axios from "axios";
import fs from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { execSync } from "child_process";
import { config } from "../config";
import { randomUUID } from "node:crypto";
import player from "play-sound";

export class VoiceResponder {
  private ttsUrl: string;
  private voiceId: string;
  private apiKey: string;
  private audioPlayer = player({ players: ["ffplay"] });

  constructor() {
    this.voiceId = config.ELEVENLABS_VOICE_ID;
    this.apiKey = config.ELEVENLABS_API_KEY;
    this.ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`;
  }

  async speak(text: string): Promise<void> {
    const id = randomUUID();
    const tempMp3Path = path.join(tmpdir(), `response-${id}.mp3`);

    const res = await axios.post(
      this.ttsUrl,
      { text },
      {
        headers: {
          "xi-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      },
    );

    await fs.writeFile(tempMp3Path, res.data);
    this.audioPlayer.play(tempMp3Path, (err) => {
      if (err) console.error("Audio playback error:", err);
    });
  }

  async listenAndRespond(): Promise<void> {
    execSync(`sox -d ${tmpdir()}/voice.wav trim 0 5`);
    execSync("main.exe -m models/ggml-base.en.bin -f audio.wav -otxt");
    const transcription = await fs.readFile(`${tmpdir()}/voice.txt`, "utf-8");

    console.log("🗣️ Heard:", transcription.trim());
    await this.speak(`You said: ${transcription.trim()}`);
  }
}
