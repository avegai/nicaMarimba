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
//Assets Variables
let pathPercLoop = "assets/SC_NM_93_perc_loop_high_atabal_3_4_time.wav";
let pathMarimbArp = "assets/SC_NM_156_marimba_monimbo_arp_tail_3_4_time_Cmaj.wav";
let pathGuitarrilla = "assets/SC_NM_150_guitarrilla_toad_3_4_time_Dmaj.wav";
let pathMarimbaFX = "assets/SC_NM_fx_rattle_wooden.wav"
let pathMarimbaPing = "assets/SC_NM_marimba_ping_G.wav";
let pathZapateo = "assets/SC_NM_156_marimba_phrase_slow_zapateo_3_4_time_Cmaj.wav";
let marimbaSad = "assets/SC_NM_82_marimba_tremolo_sad_Amin.wav";
let marimbaMasaya = "assets/SC_NM_150_marimba_masaya_Cmaj.wav";
let pathNoteC = "assets/SC_NM_marimba_single_note_C.wav";
let pathNoteD = "assets/SC_NM_marimba_single_note_D.wav";
let pathNoteE = "assets/SC_NM_marimba_single_note_E.wav";
let pathNoteG = "assets/SC_NM_marimba_single_note_G.wav";
let pathNoteF = "assets/SC_NM_marimba_single_note_F.wav";
let pathNoteA = "assets/SC_NM_marimba_single_note_A.wav";
let pathNoteB = "assets/SC_NM_marimba_single_note_B.wav";

let appStarted = false;

function preload() {
  atabal = loadSound(pathPercLoop);
  marimbaChord = loadSound(pathMarimbArp);
  marimbaFX = loadSound(pathMarimbaFX);
  zapateo = loadSound(pathZapateo);
  marimbaPing = loadSound(pathMarimbaPing);
  guitarrilla = loadSound(pathGuitarrilla);
  marimbaSad = loadSound(marimbaSad);
  marimbaMasaya = loadSound(marimbaMasaya);
  marimbaC = loadSound(pathNoteC);
  marimbaD = loadSound(pathNoteD);
  marimbaE = loadSound(pathNoteE);
  marimbaF = loadSound(pathNoteF);
  marimbaG = loadSound(pathNoteG);
  marimbaA = loadSound(pathNoteA);
  marimbaB = loadSound(pathNoteB);  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  //create modules and initialize parameters.
  delay = new p5.Delay();
  filter = new p5.LowPass();  
  distortion = new p5.Distortion();

  //connect modules

  //loops effects connections
  marimbaChord.disconnect();
  marimbaChord.connect(filter);
  marimbaSad.disconnect();
  marimbaSad.connect(filter);
  filter.disconnect();
  filter.connect(delay);
  
  marimbaFX.disconnect();
  marimbaFX.connect(delay);

  atabal.disconnect();
  atabal.connect(distortion);

  amplitude = new p5.Amplitude(0.5);
	amplitude.setInput(atabal);

  fft = new p5.FFT();
	marimbaFX.connect(fft);

  // The starting index
	start = 50;
	// The final index
	end = 500+start;
	
	// number = 200;

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
  marimbaSad.pan(paneo);

  if (mouseIsPressed) {
    distortion.drywet(0.5);
  } else {
    distortion.drywet(0);
  }

  spectrum = fft.analyze()
  
	// Set previous default
	px = width*0.25;
	py = height/2;
	for (let i = start; i < end; i+=1) {

		// Prep colour gradient
		col = Math.abs(50 - i) - 200
		stroke(col, 360, 360);
		// Lineraly interpolate x
		x = map(i, start-2, end, 0.25, 0.75)*width;
		// Alternate up and down
		y = i % 2 ? spectrum[i] : -spectrum[i]
		y += height/2
		// Draw line
		line(x, y, px, py);
		// Update coords
		px = x;
		py = y;
	}



}

function stopSound() {
  marimbaChord.stop();
  marimbaFX.stop();
  atabal.stop();
  guitarrilla.stop();
  marimbaSad.stop();
  marimbaMasaya.stop();
  marimbaPing.stop();
  zapateo.stop();
} 

function keyPressed() {
  if (appStarted) {
    switch (key) {
      case 'a':
        console.log('calling A');
        marimbaC.play();
        break;
      case 's':
        marimbaD.play();
        break;
      case 'd':  
        marimbaE.play();
        break;
      case 'f':
        marimbaF.play();
        break;
      case 'g':
        marimbaG.play();
        break;
      case 'h':
        marimbaA.play();
        break;
      case 'j':
        marimbaB.play();
        break;
      case 'k':
        marimbaPing.play();
        break;
      case '1':
        marimbaChord.play();
        marimbaChord.rate(random(-5, -1));
        // marimbaChord.loop();
        break;
      case '2':
        atabal.play();
        atabal.rate(random(0.5, 2));
        // atabal.loop();
        break;
      case '3':
        marimbaFX.play();
        marimbaFX.rate(random(-2, -0.5));
        // marimbaFX.loop();
        break
      case '4':
        marimbaSad.play();        
        break;
      case '5': 
        marimbaMasaya.play();        
        break;
      case '6': 
        zapateo.play();
        zapateo.rate(random(0.5, 2));
        // zapateo.loop();
        break;
      case '7':
        guitarrilla.rate(random(0.5, 2));
        // guitarrilla.loop();
        break;
      case '8':
        
      case '9':
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