// Each game has its own loop. The audio files are bundled for offline play.
const gameMusic = (() => {
  const preference = "tinyTouchMusic";
  let enabled = true;
  let playing = false;
  let game;
  let track;

  try { enabled = localStorage.getItem(preference) !== "off"; } catch {}

  function updatePlayback() {
    if (!enabled || !playing || document.hidden) {
      track?.pause();
      return;
    }
    if (!track) {
      track = new Audio("music-" + game + ".mp3");
      track.loop = true;
    }
    if (track.paused) track.play().catch(() => {
      // Some browsers require the next tap before allowing sound.
    });
  }

  document.addEventListener("visibilitychange", updatePlayback);
  window.addEventListener("pagehide", () => track?.pause());
  window.addEventListener("pageshow", updatePlayback);
  document.addEventListener("click", updatePlayback);
  document.addEventListener("touchend", updatePlayback);
  document.addEventListener("keyup", updatePlayback);

  return {
    label: () => enabled ? "Music on" : "Music off",
    setPlaying(active, nextGame) {
      if (playing === active && (!active || game === nextGame)) return;
      if (active && game !== nextGame) {
        track?.pause();
        track = null;
        game = nextGame;
      }
      playing = active;
      updatePlayback();
    },
    toggle() {
      enabled = !enabled;
      try { localStorage.setItem(preference, enabled ? "on" : "off"); } catch {}
      updatePlayback();
    }
  };
})();

// Completion cues are independent of the background music preference.
const gameSounds = (() => {
  const cues = {
    shapes: { notes: [72, 76, 79, 84], wave: "triangle", step: 0.10 },
    car: { notes: [57, 69, 76, 81], wave: "triangle", step: 0.09 },
    trace: { notes: [65, 72, 75, 79], wave: "sine", step: 0.13 },
    teeth: { notes: [74, 77, 81, 86], wave: "sine", step: 0.085 }
  };
  let context;
  let pendingCue;

  function playPendingCue() {
    const cue = pendingCue;
    pendingCue = null;
    if (cue && !document.hidden && performance.now() < cue.expiresAt) {
      playCue(cue.game, cue.options);
    }
  }

  function unlock() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    try {
      context ??= new AudioContext();
      if (context.state === "running") playPendingCue();
      else context.resume().then(playPendingCue).catch(() => {});
    } catch {}
  }

  // Camera play and timed results may finish without a tap.
  document.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse") unlock();
  });
  document.addEventListener("pointerup", unlock);
  document.addEventListener("keydown", unlock);

  function note(pitch, wave, start, duration, peak) {
    const tone = context.createOscillator();
    const gain = context.createGain();
    tone.type = wave;
    tone.frequency.value = 440 * 2 ** ((pitch - 69) / 12);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.016);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    tone.connect(gain).connect(context.destination);
    tone.start(start);
    tone.stop(start + duration);
  }

  function playCue(game, { finalRound = false, passed = true } = {}) {
    const { notes, wave, step } = cues[game];
    const start = context.currentTime + 0.015;
    const phrase = passed ? notes : [notes[1], notes[0]];
    phrase.forEach((pitch, index) => {
      const duration = index === phrase.length - 1 ? 0.34 : 0.21;
      note(pitch, wave, start + index * step, duration, passed ? 0.18 : 0.12);
    });
    if (passed && finalRound) {
      const resolve = start + (phrase.length - 1) * step;
      note(notes[0] - 12, "sine", resolve, 0.43, 0.09);
      note(notes[2], "sine", resolve, 0.43, 0.08);
    }
  }

  function complete(game, options) {
    if (document.hidden) return;
    if (context?.state === "running") {
      playCue(game, options);
    } else {
      // A drag can finish before the first touch release unlocks audio.
      pendingCue = { game, options, expiresAt: performance.now() + 1200 };
    }
  }

  return { complete };
})();
