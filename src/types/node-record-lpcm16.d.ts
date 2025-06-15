declare module "mic" {
  const mic: any;
  export = mic;
}

declare module "play-sound" {
  function playSound(options?: any): {
    play(file: string, callback?: (err?: Error) => void): void;
  };

  namespace playSound {}
  export = playSound;
}

declare module "whisper.cpp" {
  export default function whisper_factory(): Promise<any>;
}
