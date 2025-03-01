let marimbaSketch = (p) => {
    let appStarted = false;
    let loopEnabled = false; // Toggle for continuous looping

    let delay, filter, distortion, reverb;
    let sounds = {};
    let soundPaths = {
      percLoop: "assets/SC_NM_93_perc_loop_high_atabal_3_4_time.wav",
      marimbArp: "assets/SC_NM_156_marimba_monimbo_arp_tail_3_4_time_Cmaj.wav",
      cycling: "assets/SC_NM_168_marimba_cycling_tail_3_4_time_Amin.wav",
      marimbaFX: "assets/SC_NM_fx_rattle_wooden.wav",
      marimbaPing: "assets/SC_NM_marimba_ping_G.wav",
      zapateo: "assets/SC_NM_156_marimba_phrase_slow_zapateo_3_4_time_Cmaj.wav",
      marimbaSad: "assets/SC_NM_82_marimba_tremolo_sad_Amin.wav",
      marimbaMasaya: "assets/SC_NM_150_marimba_masaya_Cmaj.wav",
      marimbaC: "assets/SC_NM_marimba_single_note_1.wav",
      marimbaD: "assets/SC_NM_marimba_single_note_2.wav",
      marimbaE: "assets/SC_NM_marimba_single_note_3.wav",
      marimbaF: "assets/SC_NM_marimba_single_note_4.wav",
      marimbaG: "assets/SC_NM_marimba_single_note_5.wav",
      marimbaA: "assets/SC_NM_marimba_single_note_6.wav",
      marimbaB: "assets/SC_NM_marimba_single_note_7.wav",
      marimbaC2: "assets/SC_NM_marimba_single_note_8.wav",
    };
  
    p.preload = () => {
      for (let key in soundPaths) {
        sounds[key] = p.loadSound(soundPaths[key]);
      }
    };
  
    p.setup = () => {
      // p.createCanvas(p.windowWidth, p.windowHeight);
  
      // Initialize sound effects
      delay = new p5.Delay();
      filter = new p5.LowPass();
      distortion = new p5.Distortion();
      reverb = new p5.Reverb();
  
      // Connect audio effects
      sounds.marimbArp.disconnect();
      sounds.marimbArp.connect(filter);
      filter.disconnect();
      filter.connect(delay);
  
      sounds.marimbaFX.disconnect();
      sounds.marimbaFX.connect(delay);
  
      sounds.percLoop.disconnect();
      sounds.percLoop.connect(distortion);
  
      sounds.marimbaPing.disconnect();
      sounds.marimbaPing.connect(reverb);
    };

  //   p.windowResized = () => {
  //     p.resizeCanvas(p.windowWidth, p.windowHeight);
  // };
  
    p.draw = () => {
      p.frameRate(60);
    //   p.background(0);
  
      let frequency = p.map(p.mouseX, 0, p.windowWidth, 60, 20000);
      let resonance = p.map(p.mouseX, 0, p.windowWidth, 5, 100);
      filter.freq(frequency);
      filter.res(resonance);
  
      let paneo = p.map(p.mouseX, 0, p.width, -1, 1);
      sounds.marimbaFX.pan(paneo);
  
      if (p.mouseIsPressed) {
        distortion.drywet(0.5);
      } else {
        distortion.drywet(0);
      }
    };
  
    p.keyPressed = () => {
      if (!appStarted) {
        appStarted = true;  // Unlocks sound on first interaction
        return;  // This prevents execution only on the first key press
      }
  
      let keyMap = {
        a: "marimbaC",
        s: "marimbaD",
        d: "marimbaE",
        f: "marimbaF",
        g: "marimbaG",
        h: "marimbaA",
        j: "marimbaB",
        k: "marimbaC2",
        1: "marimbArp",
        2: "percLoop",
        3: "marimbaFX",
        4: "marimbaSad",
        5: "marimbaMasaya",
        6: "zapateo",
        7: "cycling",
        8: "marimbaPing",
      };

      // Toggle looping mode with 'L' key
    if (p.key.toLowerCase() === 'l') {
      loopEnabled = !loopEnabled;  // Switch between looping and non-looping
      console.log(`Looping mode: ${loopEnabled ? "ON" : "OFF"}`);
      return;
  }
  
  if (keyMap[p.key]) {
    let sound = sounds[keyMap[p.key]];

    if (["1", "2", "3", "4", "5", "6", "7", "8"].includes(p.key)) {
        // If looping mode is on, loop sound, otherwise play it once
        if (loopEnabled) {
            sound.loop();
        } else {
            sound.play();
        }
    } else {
        sound.play(); // One-shot sounds always play normally
    }
}


      // Stop all sounds when "0" is pressed
      if (p.key === '0') {
        p.stopSound();
      }
  };
  
    p.stopSound = () => {
      for (let key in sounds) {
        sounds[key].stop();
      }
    };
  };
  
  // Attach the sketch to a specific container
  new p5(marimbaSketch, "sketch-container-1");