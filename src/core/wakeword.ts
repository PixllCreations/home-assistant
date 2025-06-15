import { spawn } from "child_process";
import { Porcupine, BuiltinKeyword } from "@picovoice/porcupine-node";

export async function waitForWakeWord(): Promise<void> {
  const ACCESS_KEY = process.env.PICO_ACCESS_KEY!;
  const porcupine = new Porcupine(ACCESS_KEY, [BuiltinKeyword.JARVIS], [0.7]);

  const sox = spawn(
    "sox",
    [
      "-t",
      "waveaudio",
      "Chat Mic (4- TC-HELICON GoXLR)", // Input device
      "-r",
      porcupine.sampleRate.toString(),
      "-c",
      "1",
      "-b",
      "16",
      "-e",
      "signed-integer",
      "-L",
      "-t",
      "raw",
      "-",
    ],
    { shell: false },
  );

  const pcmBuffer: number[] = [];

  return new Promise((resolve, reject) => {
    let detected = false;

    sox.stdout.on("data", (data: Buffer) => {
      if (detected) return;

      for (let i = 0; i < data.length; i += 2) {
        pcmBuffer.push(data.readInt16LE(i));
      }

      while (pcmBuffer.length >= porcupine.frameLength) {
        const frame = pcmBuffer.splice(0, porcupine.frameLength);
        const keywordIndex = porcupine.process(Int16Array.from(frame));

        if (keywordIndex >= 0) {
          detected = true; // prevent reprocessing
          console.log("✅ Wake word detected!");
          porcupine.release();
          sox.kill();
          resolve();
          break;
        }
      }
    });

    sox.stderr.on("data", (err) => {
      console.error("[sox] error:", err.toString());
    });

    sox.on("close", (code) => {
      if (code !== 0) {
        console.error(`[sox] exited with code ${code}`);
        reject(new Error(`sox exited with code ${code}`));
      }
    });
  });
}
