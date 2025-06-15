import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";

export async function transcribe(): Promise<string> {
  const device = "Chat Mic (4- TC-HELICON GoXLR)";

  // Record audio
  execSync(
    `sox -t waveaudio "${device}" -c 1 -r 16000 -b 16 -e signed-integer audio.wav trim 0 5 vol 25dB`,
  );

  // Transcribe with whisper CLI
  const modelPath = resolve("models/ggml-base.en-q8_0.bin");
  const cliPath = resolve("whisper-cli.exe");

  execSync(`"${cliPath}" -m "${modelPath}" -f audio.wav -otxt`);

  const audioFile = "audio.wav";
  const transcriptFile = `${audioFile}.txt`;
  const result = readFileSync(transcriptFile, "utf8").trim();
  console.log(`Transcription result: ${result}`);
  return result;
}
