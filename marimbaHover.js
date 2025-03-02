document.addEventListener("DOMContentLoaded", () => {
  // We'll use the sounds already loaded in the p5 sketch
  const p5Instance = window._p5Instance;  // This will be set by the main sketch
  if (!p5Instance) {
    console.error('p5 instance not found');
    return;
  }

  const hoverSoundMap = [
    "marimbaC",
    "marimbaD",
    "marimbaE",
    "marimbaF",
    "marimbaG",
    "marimbaA",
    "marimbaB",
    "marimbaC2"
  ];

  let keys = document.querySelectorAll(".marimba .key");

  keys.forEach((key, index) => {
    if (index < hoverSoundMap.length) {
      key.addEventListener("mouseenter", async () => {
        try {
          const sound = p5Instance.sounds[hoverSoundMap[index]];
          if (sound && p5Instance.audioContextStarted) {
            await sound.play();
          }
        } catch (e) {
          console.error('Failed to play hover sound:', e);
        }
      });
    }
  });
});