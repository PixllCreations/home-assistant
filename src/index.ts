import { waitForWakeWord } from "./core/wakeword";
import { VoiceResponder } from "./core/tts";
import { transcribe } from "./core/stt";
import { respondTo } from "./core/brain";
import { log } from "./utils/logger";

async function main() {
  log("Jarvis Assistant is online.");
  while (true) {
    await waitForWakeWord();
    const input = await transcribe();
    log("Transcribed: " + input);
    const reply = await respondTo(input);
    const responder = new VoiceResponder();
    await responder.speak(reply);
  }
}

main();
