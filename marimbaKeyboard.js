let marimbaSketch = (p) => {
    // Make p5 instance available globally for hover effects
    window._p5Instance = p;
    p.sounds = {};  // Make sounds accessible
    p.audioContextStarted = false;  // Make audio context state accessible

    let loopEnabled = false;
    let currentlyLooping = new Set(); // Keep track of which sounds are currently looping
    let delay, LowPass, highPass, distortion, reverb;
    
    // Define which sounds should have which effects
    const effectRouting = {
      lowPassDelay: ["marimbArp", "percLoop"], // Sounds that get both lowpass and delay
      highPass: ["marimbaMasaya", "marimbaFX"], // Sounds that get highpass
      distortion: ["percLoop", "cycling"], // Sounds that get distortion
      reverb: ["marimbaPing", "marimbaSad"], // Sounds that get reverb
      delay: ["marimbaFX", "zapateo"], // Sounds that only get delay
    };
    
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

    // Initialize audio context and unlock audio
    const initializeAudio = async () => {
      if (!p.audioContextStarted) {
        try {
          await p.userStartAudio();
          p.audioContextStarted = true;
          console.log('Audio context started successfully');
          
          // Connect all sounds to their respective effects
          for (let soundKey in p.sounds) {
            p.sounds[soundKey].disconnect(); // Disconnect first to be safe
            
            // Special case for percLoop which needs both lowpass+delay and distortion
            if (soundKey === 'percLoop') {
              p.sounds[soundKey].connect(distortion);
              distortion.connect(LowPass);
              LowPass.connect(delay);
              delay.connect();
            }
            // Apply effects based on the routing configuration
            else if (effectRouting.lowPassDelay.includes(soundKey)) {
              p.sounds[soundKey].connect(LowPass);
              LowPass.connect(delay);
              delay.connect();
            } else if (effectRouting.highPass.includes(soundKey)) {
              p.sounds[soundKey].connect(highPass);
              highPass.connect();
            } else if (effectRouting.distortion.includes(soundKey)) {
              p.sounds[soundKey].connect(distortion);
              distortion.connect();
            } else if (effectRouting.reverb.includes(soundKey)) {
              p.sounds[soundKey].connect(reverb);
              reverb.connect();
            } else if (effectRouting.delay.includes(soundKey)) {
              p.sounds[soundKey].connect(delay);
              delay.connect();
            } else {
              // Sounds with no effects connect directly to output
              p.sounds[soundKey].connect();
            }
          }

          // Try to play and immediately stop a sound to fully unlock audio
          const testSound = p.sounds.marimbaC;
          testSound.play();
          testSound.stop();
        } catch (e) {
          console.error('Failed to initialize audio:', e);
        }
      }
    };
  
    p.preload = () => {
      for (let key in soundPaths) {
        p.sounds[key] = p.loadSound(soundPaths[key]);
      }
    };
  
    p.setup = () => {
      // Initialize sound effects
      delay = new p5.Delay();
      LowPass = new p5.LowPass();
      highPass = new p5.HighPass();
      distortion = new p5.Distortion(0.5); // Set initial distortion amount
      reverb = new p5.Reverb();

      // Set up initial effect parameters
      delay.drywet(0.6);
      delay.feedback(0.5);
      delay.delayTime(0.4);
      
      reverb.drywet(0.5);
      reverb.set(3, 2);
      
      // Initialize filter parameters
      LowPass.freq(20000);
      LowPass.res(5);
      
      highPass.freq(500);
      highPass.res(5);

      // Initialize distortion
      distortion.drywet(0); // Start with no wet signal
      
      // Add multiple event listeners for first interaction
      document.addEventListener('click', initializeAudio);
      document.addEventListener('keydown', initializeAudio);
      document.addEventListener('touchstart', initializeAudio);

      document.querySelectorAll('.loops button, .controls button').forEach(el => {
        el.addEventListener('click', () => {
          const loopKey = el.getAttribute('data-key');
          handleKeysAndLoops(loopKey);
        })
      })
    };

    p.draw = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);

      if (!p.audioContextStarted) return;

      // Map mouse X to filter frequencies (logarithmic scale for better control)
      let lowPassFreq = p.map(p.mouseX, 0, p.windowWidth, 20, 20000);
      lowPassFreq = Math.pow(lowPassFreq, 2) / 20000;
      LowPass.freq(lowPassFreq);
      
      let highPassFreq = p.map(p.mouseX, 0, p.windowWidth, 20, 2000);
      highPassFreq = Math.pow(highPassFreq, 2) / 2000;
      highPass.freq(highPassFreq);

      // Map mouse Y to resonance with a gentler range
      let resonance = p.map(p.mouseY, 0, p.windowHeight, 15, 3);
      
      // Only apply resonance to sounds that have filters
      if (effectRouting.lowPassDelay.some(key => currentlyLooping.has(key))) {
        LowPass.res(resonance);
      }
      if (effectRouting.highPass.some(key => currentlyLooping.has(key))) {
        highPass.res(resonance);
      }
  
      // Map mouse X to panning - only for sounds that should have it
      let panValue = p.map(p.mouseX, 0, p.windowWidth, -1, 1);
      // Apply panning to specific sounds if they're playing
      if (p.sounds.marimbaFX && p.sounds.marimbaFX.isPlaying()) {
        p.sounds.marimbaFX.pan(panValue);
      }
      if (p.sounds.marimbaSad && p.sounds.marimbaSad.isPlaying()) {
        p.sounds.marimbaSad.pan(panValue);
      }
  
      // Handle distortion with mouse press - only for sounds that should have it
      if (p.mouseIsPressed && effectRouting.distortion.some(key => p.sounds[key].isPlaying())) {
        distortion.set(0.9, '2x'); // Increase distortion amount and oversample
        distortion.drywet(0.7); // More wet signal for stronger effect
      } else {
        distortion.set(0.5, '2x'); // Lower distortion when not pressed
        distortion.drywet(0); // No wet signal when not pressed
      }
    };
  
    p.keyPressed = async (e) => handleKeysAndLoops(e.key.toLowerCase())

    async function handleKeysAndLoops(key){
      // Always try to initialize audio first
      if (!p.audioContextStarted) {
        await initializeAudio();
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

      // Toggle looping mode with 'L' key or loop button
      if (key === 'l' || key === 'loop') {
        loopEnabled = !loopEnabled;
        console.log(`Looping mode: ${loopEnabled ? "ON" : "OFF"}`);
        
        // If turning off loop mode, stop all currently looping sounds
        if (!loopEnabled) {
          for (let soundKey of currentlyLooping) {
            p.sounds[soundKey].stop();
          }
          currentlyLooping.clear();

          document.querySelector('button[data-key="loop"]').classList.remove('enabled');
          document.querySelectorAll('.numbered-loop').forEach(el => {
            el.classList.remove('enabled');
          })
        } else {
          document.querySelector('button[data-key="loop"]').classList.add('enabled');
        }
        return;
      }
    
      if (keyMap[key]) {
        try {
          let soundKey = keyMap[key];
          let sound = p.sounds[soundKey];0
          
          if (["1", "2", "3", "4", "5", "6", "7", "8"].includes(key)) {
            const button = document.querySelector(`button[data-key="${key}"]`);
            // If the sound is already looping, stop it
            if (currentlyLooping.has(soundKey) || button.classList.contains('enabled')) {
              sound.stop();
              currentlyLooping.delete(soundKey);

              button.classList.remove('enabled')
            } else {
              // Start the sound (either looping or one-shot)
              button.classList.add('enabled')
              if (loopEnabled) {
                await sound.loop();
                currentlyLooping.add(soundKey);
              } else {
                await sound.play();
              }
            }
          } else {
            // For non-loopable sounds, just play them
            document.querySelector(`#${keyMap[key]}`).style.background = 'var(--active)'

            setTimeout(() => {
              document.querySelector(`#${keyMap[key]}`).style.background = ''
            }, 200)

            await sound.play();
          }
        } catch (e) {
          console.error('Failed to play sound:', e);
        }
      }

      // Stop all sounds when "0" is pressed
      if (key === '0' || key === 'stop') {
        p.stopSound();
        currentlyLooping.clear(); // Clear the looping set

        document.querySelectorAll('.numbered-loop').forEach(el => {
          el.classList.remove('enabled');
        })
      }
    };
  
    p.stopSound = () => {
      for (let key in p.sounds) {
        p.sounds[key].stop();
      }
    };
  };
  new p5(marimbaSketch, "sketch-container-1");
