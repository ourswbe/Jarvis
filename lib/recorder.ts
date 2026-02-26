export type RecorderController = {
  stop: () => Promise<Blob>;
};

export async function startRecording(): Promise<RecorderController> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Microphone API is not supported in this browser');
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
