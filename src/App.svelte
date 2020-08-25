<script lang="ts">
	import { onMount, onDestroy, setContext } from "svelte";
  import { visualize } from "./visualize";

  let isRecording = false;
  let shouldStop = false;
  let mediaRecorder = null;
  let chunks = [];

  export let canvas: HTMLCanvasElement;
  export let audio: HTMLAudioElement;

  async function getMedia(constraints: MediaStreamConstraints) {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      console.log("The following error occured: " + err);
    }

    return stream;
  }

  async function givemeMic() {
    const cc = canvas.getContext("2d", {});
    const ms = await getMedia({ audio: true, video: false });
    mediaRecorder = new MediaRecorder(ms);
    isRecording = true;

    mediaRecorder.ondataavailable = (e: any) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = function (e) {
      console.log("data available after MediaRecorder.stop() called.");
      const clipName = prompt(
        "Enter a name for your sound clip?",
        "My unnamed clip"
      );

      audio.setAttribute("controls", "");
      audio.controls = true;

      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
    };

    visualize(ms, canvas);
    mediaRecorder.start();
  }

  function handleStop() {
    mediaRecorder.stop();
  }
</script>

<style>
  main {
    text-align: center;
    padding: 1em max(4rem, calc(50% - 15rem));
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>

<main>
  <button on:click={isRecording ? handleStop : givemeMic}>
    🎤{isRecording ? 'Stop' : 'Rec'}
  </button>

  <audio bind:this={audio}></audio>

  <canvas bind:this={canvas} width="500" height="500" />
</main>
