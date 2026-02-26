export type RecorderController = {
  stop: () => Promise<Blob>;
};

function mapMicrophoneError(error: unknown): string {
  if (!(error instanceof DOMException)) {
    return error instanceof Error ? error.message : 'Unable to access microphone';
  }

  switch (error.name) {
    case 'NotAllowedError':
      return 'Microphone access denied. Allow microphone permission in your browser settings.';
    case 'NotFoundError':
      return 'No microphone device found. Connect a microphone and try again.';
    case 'NotReadableError':
      return 'Microphone is busy in another app. Close other audio apps and retry.';
    case 'OverconstrainedError':
      return 'Requested microphone constraints are not supported by this device.';
    case 'SecurityError':
      return 'Microphone access is blocked by browser security settings.';
    default:
      return error.message || 'Unable to access microphone';
  }
}

export async function startRecording(): Promise<RecorderController> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Microphone API is not supported in this browser');
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    throw new Error(mapMicrophoneError(error));
  }

  const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: BlobPart[] = [];

  recorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });

  recorder.start();

  return {
    stop: () =>
      new Promise<Blob>((resolve, reject) => {
        recorder.addEventListener('stop', () => {
          stream.getTracks().forEach((track) => track.stop());
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          if (blob.size === 0) {
            reject(new Error('Empty recording, please try again'));
            return;
          }
          resolve(blob);
        });

        recorder.addEventListener('error', () => {
          stream.getTracks().forEach((track) => track.stop());
          reject(new Error('Recording failed'));
        });

        recorder.stop();
      })
  };
}
