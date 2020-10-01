// DOM Elements
const musicContainer = document.querySelector('#music-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');
const cover = document.querySelector('#cover');
const musicTitle = document.querySelector('#music-title');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const paths = document.querySelectorAll('path');
const playerDownBtn = document.querySelector('#player-down');
const playerUpBtn = document.querySelector('#player-up');
const canvas = document.querySelector('#analyser-render');
const ctx = canvas.getContext('2d');
const bars_color = '#fe8daa';

let context, source, analyser, fbc_array;

// Song Titles
const songs = ['Так мало', 'HIGH LOVE', 'summer'];
let songIndex = 1;

loadSong(songs[songIndex]);

function loadSong(song) {
  musicTitle.innerText = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `img/${song}.jpg`;
}

function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('.material-icons').innerText = 'pause';
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('.material-icons').innerText = 'play_arrow';
  audio.pause();
}

// Previous Song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// Next Song
function nextSong() {
  songIndex++;

  if (songIndex === songs.length) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
  const totalWidth = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / totalWidth) * duration;
}

function updateClassList(el, className) {
  if (el.classList.contains(className)) {
    el.classList.remove(className);
  } else {
    el.classList.add(className);
  }
}

function initAnalyser() {
  context = new AudioContext();
  analyser = context.createAnalyser();
  source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
  frameLoop();
}

function frameLoop() {
  window.requestAnimationFrame(frameLoop);
  fbc_array = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(fbc_array);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bars_color;
  bars = 100;

  for (let i = 0; i < 100; i++) {
    let x = i * 3;
    let bar_width = 2;
    let bar_height = -(fbc_array[i] / 2);

    ctx.fillRect(x, canvas.height, bar_width, bar_height);
  }
}

// EventListners
window.addEventListener('load', initAnalyser, false);

playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  isPlaying ? pauseSong() : playSong();

  context.resume().then(() => {
    console.log('Playback resumed successfully');
  });
});

// Change Songs
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/ Song Update
audio.addEventListener('timeupdate', updateProgress);

// Click on Progress Bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

playerDownBtn.addEventListener('click', () => {
  updateClassList(musicContainer, 'hide-player');
  playerUpBtn.style.opacity = '1';
  context.resume().then(() => {
    console.log('Playback resumed successfully');
  });
});

playerUpBtn.addEventListener('click', () => {
  updateClassList(musicContainer, 'hide-player');
  playerUpBtn.style.opacity = '0';
  context.resume();
});
