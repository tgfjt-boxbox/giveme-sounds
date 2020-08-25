export function visualize(stream: MediaStream, canvas: HTMLCanvasElement) {
  const audioCtx = new AudioContext();
  const cc = canvas.getContext("2d", {});

  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048; // 高速フーリエ変換のデータサイズ
  const bufferLength = analyser.frequencyBinCount; // analyser.fftSizeの半分
  const dataArray = new Uint8Array(bufferLength);

  console.log(analyser.minDecibels, analyser.maxDecibels);

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    cc.fillStyle = 'rgb(20, 20, 20)';
    cc.fillRect(0, 0, WIDTH, HEIGHT);

    cc.lineWidth = 1;
    cc.strokeStyle = 'rgb(255, 255, 200)';

    cc.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT / 2;

      if (i === 0) {
        cc.moveTo(x, y);
      } else {
        cc.lineTo(x, y);
      }

      x += sliceWidth;
    }

    cc.lineTo(canvas.width, canvas.height / 2);
    cc.stroke();
  }
}
