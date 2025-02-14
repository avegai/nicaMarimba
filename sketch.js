let atabal;
let marimbaChord;
let marimbaFX;
let marimbaC;
let marimbaE;
let marimbaG;
let delay;
let filter;
let distortion;
let paneo;
let started = false;
// TIP: cambiar nombre a algo mas explicito, como pathNoteC, pathPercLoopHigh, etc
let pathPercLoop = "assets/SC_NM_93_perc_loop_high_atabal_3_4_time.wav";
let pathMarimbArp = "assets/SC_NM_156_marimba_monimbo_arp_tail_3_4_time_Cmaj.wav";
let pathMarimbaFX = "assets/SC_NM_fx_rattle_wooden.wav"
let pathNoteC = "assets/SC_NM_marimba_single_note_C.wav";
let pathNoteE = "assets/SC_NM_marimba_single_note_E.wav";
let pathNoteG = "assets/SC_NM_marimba_single_note_G.wav";

let appStarted = false;

function preload() {
  atabal = loadSound(pathPercLoop);
  marimbaChord = loadSound(pathMarimbArp);
  marimbaFX = loadSound(pathMarimbaFX);
  marimbaC = loadSound(pathNoteC);
  marimbaE = loadSound(pathNoteE);
  marimbaG = loadSound(pathNoteG);
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //create modules and initialize parameters.
  delay = new p5.Delay();
  filter = new p5.LowPass();  
  distortion = new p5.Distortion();

  //connect modules
  marimbaChord.disconnect();
  marimbaChord.connect(filter);
  filter.disconnect();
  filter.connect(delay);
  

  marimbaFX.disconnect();
  marimbaFX.connect(delay);

  atabal.disconnect();
  atabal.connect(distortion);

}


function draw() {
  frameRate(60);
  background(0);
  
  let frequency = map(mouseX, 0, window.innerWidth, 60, 20000);
  let resonance = map(mouseX, 0, window.innerWidth, 5, 100);
  filter.freq(frequency); 
  filter.res(resonance);
    
  let paneo = map(mouseX, 0, width, -1, 1);
  marimbaFX.pan(paneo); 

  if (mouseIsPressed) {
    distortion.drywet(0.5);
  } else {
    distortion.drywet(0);
  }
}

function stopSound() {
  marimbaChord.stop();
  marimbaFX.stop();
  atabal.stop();

}

function keyPressed() {
  if (appStarted) {
    switch (key) {
      case 'a':
        console.log('calling A');
        marimbaC.play();
        break;
      case 's':
        marimbaE.play();
        break;
      case 'd':  
        marimbaG.play();
        break;
      case '1':
        marimbaChord.play();
        break;
      case '2':
        atabal.play();
        break;
      case '3':
        marimbaFX.play();
        break
      case '4':
        marimbaChord.rate(random(-5, -1));
        marimbaChord.loop();
        break;
      case '5': 
        marimbaFX.rate(random(-2, -0.5));
        marimbaFX.loop();
        break;
      case '6': 
        atabal.rate(random(0.5, 2));
        atabal.loop();
        break;
      case '0':
        stopSound();
        break;
      default:
        break;
    }

  }
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const closeOverlay = document.getElementById("closeOverlay");

  // hide overlay and start app's functionality 
  closeOverlay.addEventListener("click", () => {
    overlay.style.display = 'none';
    appStarted = true;
  });
});