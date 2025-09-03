/* Canvas Clock */ 

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "#00ffff";
ctx.lineWidth = 17;
ctx.shadowBlur = 15;
ctx.shadowColor = "#00ffff";

function degToRad(degree) {
  var factor = Math.PI / 180;
  return degree * factor;
}

function renderTime() {
  var now = new Date();
  var today = now.toDateString();
  var time = now.toLocaleTimeString();
  var hrs = now.getHours();
  var min = now.getMinutes();
  var sec = now.getSeconds();
  var mil = now.getMilliseconds();
  var smoothsec = sec + mil / 1000;
  var smoothmin = min + smoothsec / 60;

  //Background
  gradient = ctx.createRadialGradient(250, 250, 5, 250, 250, 300);
  gradient.addColorStop(0, "#021027");
  gradient.addColorStop(1, "#021027");
  ctx.fillStyle = gradient;
  //ctx.fillStyle = 'rgba(00 ,00 , 00, 1)';
  ctx.fillRect(0, 0, 500, 500);
  //Hours
  ctx.beginPath();
  ctx.arc(260, 200, 130, degToRad(270), degToRad(hrs * 30 - 90));
  ctx.stroke();
  //Minutes
  ctx.beginPath();
  ctx.arc(260, 200, 100, degToRad(270), degToRad(smoothmin * 6 - 90));
  ctx.stroke();
  //Seconds
  ctx.beginPath();
  ctx.arc(260, 200, 70, degToRad(270), degToRad(smoothsec * 6 - 90));
  ctx.stroke();
  //Date
  ctx.font = "13px Helvetica";
  ctx.fillStyle = "rgba(00, 255, 255, 1)";
  ctx.fillText(today, 210, 190);
  //Time
  ctx.font = "13px Helvetica Bold";
  ctx.fillStyle = "rgba(00, 255, 255, 1)";
  ctx.fillText(time + ":" + mil, 210, 220);
}
setInterval(renderTime, 40);


// ------------------------------------------------------------------- //
// -----------------------   Audio Visualizer  ----------------------- //

(() => {
  class Visualizer {
    constructor(canvasId, analyser, options = {}) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.analyser = analyser;
      this.options = options;
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }

    resize() {
      this.width = this.canvas.clientWidth;
      this.height = this.canvas.clientHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height); // Canvas vollst ndig l schen
    }


    animate() {
      this.clear(); // Canvas bei jedem Frame l schen
      this.draw();
      requestAnimationFrame(() => this.animate());
    }

    start() {
      this.animate();
    }
  }

  class OscilloscopeVisualizer extends Visualizer {
    constructor(canvasId, analyser) {
      super(canvasId, analyser);
      this.bufferLength = analyser.fftSize;
      this.dataArray = new Uint8Array(this.bufferLength);
    }

    draw() {
      this.analyser.getByteTimeDomainData(this.dataArray);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "rgba(255,255,255,.8)";
      this.ctx.beginPath();
      const sliceWidth = this.width / this.bufferLength;
      let x = 0;
      this.dataArray.forEach((value, i) => {
        const v = value / 128;
        const y = (v * this.height) / 2;
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
        x += sliceWidth;
      });
      this.ctx.lineTo(this.width, this.height / 2);
      this.ctx.stroke();
    }
  }

  class FrequencyVisualizer extends Visualizer {
    constructor(canvasId, analyser) {
      super(canvasId, analyser);
      this.bufferLength = analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
    }

    draw() {
      this.analyser.getByteFrequencyData(this.dataArray);
      const barWidth = (this.width / this.bufferLength) * 2.5;
      let x = 0;
      this.dataArray.forEach((value) => {
        const barHeight = (value / 255) * this.height;
        this.ctx.fillStyle = `rgba(255,255,255,.8)`;
        this.ctx.fillRect(x, this.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      });
    }
  }

  class CircularVisualizer extends Visualizer {
    constructor(canvasId, analyser) {
      super(canvasId, analyser);
      this.bufferLength = analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
    }

    draw() {
      this.analyser.getByteFrequencyData(this.dataArray);
      const radius = Math.min(this.width, this.height) / 4;
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      const bars = this.bufferLength;
      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const barLength = (this.dataArray[i] / 255) * radius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const xEnd = centerX + Math.cos(angle) * (radius + barLength);
        const yEnd = centerY + Math.sin(angle) * (radius + barLength);
        const gradient = this.ctx.createLinearGradient(x, y, xEnd, yEnd);
        gradient.addColorStop(0, "rgba(16,24,32,0.2)");
        gradient.addColorStop(1, `hsl(${(i / bars) * 360}, 100%, 50%)`);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(xEnd, yEnd);
        this.ctx.stroke();
      }
    }
  }

  const initializeVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);

      // Erstelle Analyser f r jede Visualisierung mit unterschiedlichen FFT-Gr  en
      const oscAnalyser = audioCtx.createAnalyser();
      oscAnalyser.fftSize = 2048;

      const freqAnalyser = audioCtx.createAnalyser();
      freqAnalyser.fftSize = 256;

      const circAnalyser = audioCtx.createAnalyser();
      circAnalyser.fftSize = 512;

      // Verbinde die Quelle mit allen Analysern
      source.connect(oscAnalyser);
      source.connect(freqAnalyser);
      source.connect(circAnalyser);

      // Initialisiere jede Visualisierung
      const oscVisualizer = new OscilloscopeVisualizer("oscilloscopeCanvas", oscAnalyser);
      const freqVisualizer = new FrequencyVisualizer("frequencyCanvas", freqAnalyser);
      const circVisualizer = new CircularVisualizer("circularCanvas", circAnalyser);

      // Starte die Animationen
      oscVisualizer.start();
      freqVisualizer.start();
      circVisualizer.start();
    } catch (err) {
      console.error("Fehler beim Zugriff auf das Mikrofon:", err);
    }
  };

  // Starte die Initialisierung, sobald das DOM geladen ist
  window.addEventListener("DOMContentLoaded", initializeVisualizer);
})();



// --------------------------------------------------------------- //
// -----------------------   Music Player  ----------------------- //

const audioPlayer = document.getElementById("audioPlayer");
const audioPlayerControl = document.getElementById("audioPlayerControl");
const playPauseIcon = document.getElementById("playPauseIcon");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const progressBarContainer = document.getElementById("progressBarContainer");
const progressBar = document.getElementById("progressBar");
const volumeIcon = document.getElementById("volumeIcon");
const volumeControlContainer = document.getElementById(
	"volumeControlContainer"
);
const volumeControl = document.getElementById("volumeControl");
const contentElement = document.getElementById("content");
const snowContainer = document.getElementById("snow-container");


let isDragging = false;
let clickTime, inputTime;
let currentLyricIndex = 0;
let index = 0;
let snowAnimation;

playPauseIcon.addEventListener("click", togglePlay);
audioPlayer.addEventListener("timeupdate", updateProgressBar);
audioPlayer.addEventListener("ended", resetPlayer);
progressBarContainer.addEventListener("click", seek);
progressBarContainer.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", endDrag);
volumeIcon.addEventListener("click", toggleVolumeControl);
volumeControl.addEventListener("input", updateVolume);
document.addEventListener("click", hideVolumeControl);

function togglePlay() {
	audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
	playIcon.style.display = audioPlayer.paused ? "block" : "none";
	pauseIcon.style.display = audioPlayer.paused ? "none" : "block";
}

function updateProgressBar() {
	if (!isDragging) {
		const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
		progressBar.style.width = `${progress}%`;
		progressBarContainer.style.setProperty("--progress", `${progress}%`);
	}
}

function seek(event) {
	audioPlayer.currentTime =
		(event.offsetX / progressBarContainer.offsetWidth) * audioPlayer.duration;
}

function resetPlayer() {
	playIcon.style.display = "block";
	pauseIcon.style.display = "none";
	progressBar.style.width = "0%";
	progressBarContainer.style.setProperty("--progress", "0%");
	audioPlayer.currentTime = 0;
}

function startDrag(event) {
	isDragging = true;
	drag(event);
}

function drag(event) {
	if (isDragging) {
		const percent = Math.min(
			Math.max(
				(event.clientX - progressBarContainer.getBoundingClientRect().left) /
					progressBarContainer.offsetWidth,
				0
			),
			1
		);
		progressBar.style.width = `${percent * 100}%`;
		progressBarContainer.style.setProperty("--progress", `${percent * 100}%`);
	}
}

function endDrag(event) {
	if (isDragging) {
		isDragging = false;
		const percent = Math.min(
			Math.max(
				(event.clientX - progressBarContainer.getBoundingClientRect().left) /
					progressBarContainer.offsetWidth,
				0
			),
			1
		);
		audioPlayer.currentTime = percent * audioPlayer.duration;
	}
}

function toggleVolumeControl() {
	volumeControlContainer.style.transform =
		volumeControlContainer.style.transform === "translate(230px, -40px)"
			? "translate(310px, -40px)"
			: "translate(230px, -40px)";

	clearTimeout(clickTime);
	clickTime = setTimeout(() => {
		if (audioPlayer.volume == volumeControl.value) {
			volumeControlContainer.style.transform = "translate(230px, -40px)";
		}
	}, 5000);
}

function updateVolume() {
	audioPlayer.volume = volumeControl.value;
	clearTimeout(inputTime);
	inputTime = setTimeout(() => {
		volumeControlContainer.style.transform = "translate(230px, -40px)";
	}, 2000);
}

function hideVolumeControl(event) {
	if (
		!volumeControlContainer.contains(event.target) &&
		!volumeIcon.contains(event.target)
	) {
		volumeControlContainer.style.transform = "translate(230px, -40px)";
	}
}


function createSnowflakes() {
	for (let i = 0; i < 100; i++) {
		const snowflake = document.createElement("div");
		snowflake.className = "snowflake";
		snowflake.style.width = `${Math.random() * 5 + 2}px`;
		snowflake.style.height = snowflake.style.width;
		snowflake.style.left = `${Math.random() * 100}vw`;
		snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
		snowflake.style.animationDelay = `${Math.random() * 2}s`;
		snowContainer.appendChild(snowflake);
	}
}

function animateSnowflakes() {
	document.querySelectorAll(".snowflake").forEach((snowflake) => {
		const startPosition = parseFloat(snowflake.style.left);
		const endPosition = startPosition + (Math.random() * 10 - 5);
		snowflake.animate(
			[
				{ transform: `translate(0, -10px)`, opacity: 0 },
				{ opacity: 0.8, offset: 0.1 },
				{
					transform: `translate(${endPosition - startPosition}vw, 100vh)`,
					opacity: 0
				}
			],
			{
				duration: parseFloat(snowflake.style.animationDuration) * 1000,
				iterations: Infinity
			}
		);
	});
}

audioPlayer.addEventListener("play", () => {
	createSnowflakes();
	snowAnimation = requestAnimationFrame(animateSnowflakes);
	currentLyricIndex = 0;
	updateLyrics();
});

audioPlayer.addEventListener("pause", () => {
	if (snowAnimation) cancelAnimationFrame(snowAnimation);
	document
		.querySelectorAll(".snowflake")
		.forEach((snowflake) =>
			snowflake.getAnimations().forEach((animation) => animation.pause())
		);
});

audioPlayer.addEventListener("ended", () =>
	cancelAnimationFrame(snowAnimation)
);
audioPlayer.addEventListener("seeked", () => {
	currentLyricIndex =
		lyrics.findIndex((lyric) => lyric.time > audioPlayer.currentTime) - 1;
	currentLyricIndex = Math.max(currentLyricIndex, 0);
	contentElement.textContent = "";
	index = 0;
	updateLyrics();
});

let mouseMoveTimeout;
document.addEventListener("mousemove", () => {
	clearTimeout(mouseMoveTimeout);
	const audioBox = document.querySelector(".audioBox");
	audioBox.style.transform = "translate(0, -50%)";
	audioBox.style.opacity = 1;
	document.body.style.cursor = "auto";
	mouseMoveTimeout = setTimeout(() => {
		audioBox.style.transform = "translate(0, 50%)";
		audioBox.style.opacity = 0;
		document.body.style.cursor = "none";
	}, 5000);
});

