document.addEventListener("DOMContentLoaded", () => {
  let soundPaths = [
    "assets/SC_NM_marimba_single_note_1.wav",
    "assets/SC_NM_marimba_single_note_2.wav",
    "assets/SC_NM_marimba_single_note_3.wav",
    "assets/SC_NM_marimba_single_note_4.wav",
    "assets/SC_NM_marimba_single_note_5.wav",
    "assets/SC_NM_marimba_single_note_6.wav",
    "assets/SC_NM_marimba_single_note_7.wav",
    "assets/SC_NM_marimba_single_note_8.wav",
  ];

  // Preload sounds
  let sounds = soundPaths.map(path => new Audio(path));

  let keys = document.querySelectorAll(".marimba .key"); // Select marimba keys

  keys.forEach((key, index) => {
    if (index < sounds.length) { // Prevent errors if there are extra keys
      key.addEventListener("mouseenter", () => {
        sounds[index].currentTime = 0; // Reset sound to start
        sounds[index].play(); // Play sound
      });
    }
  });
});