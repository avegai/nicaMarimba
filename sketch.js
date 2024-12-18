let atabal;
let marimbaChord;
let marimbaC;
let marimbaE;
let marimbaG;
let delay;
let filter;
let started = false;
let path = "assets/SC_NM_93_perc_loop_high_atabal_3_4_time.wav";
let path2 = "assets/SC_NM_156_marimba_monimbo_arp_tail_3_4_time_Cmaj.wav";
let path3 = "assets/SC_NM_marimba_single_note_C.wav";
let path4 = "assets/SC_NM_marimba_single_note_E.wav";
let path5 = "assets/SC_NM_marimba_single_note_G.wav";
let img;
let button;
let paneo;

function preload() {
  atabal = loadSound(path);
  marimbaChord = loadSound(path2);
  marimbaC = loadSound(path3);
  marimbaE = loadSound(path4);
  marimbaG = loadSound(path5);
  
  img = loadImage("assets/bg_img.jpg");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  button = createButton("start - stop");
  button.position(width / 2, height / 2 + 325);

  //call start sound when the button is pressed.
  button.mousePressed(startSound);

  //create modules and initialize parameters.
  delay = new p5.Delay();
  delay.delayTime(random(0.1, 10));
  delay.feedback(0.5);
  filter = new p5.LowPass();
  // atabal.loop();
  // marimbaChord.loop();

  //connect modules
  atabal.disconnect();
  filter.disconnect();
  atabal.connect(filter);
  filter.connect(delay);
  
  marimbaChord.disconnect();
  marimbaChord.connect(delay);

  imageMode(CENTER);
  img.filter(GRAY);
}


function draw() {
  // frameRate(13);
  background(0);
  img.resize(1000, 500);
  image(img, width / 2, height / 2);
  
  marimbaChord.rate(random(0, 2));

  let frequency = map(mouseY, 0, height, 0, 20000);
  // let resonance = map(mouseY, height, 0, 5, 25);
  filter.res(5);
  filter.freq(frequency);
    
  let paneo = map(mouseX, 0, width, -1, 1);
  atabal.pan(paneo); 
  marimbaChord.pan(paneo);
  
}

function startSound() {
  if (!started) {
    // atabal.play();
    // marimbaChord.play();
    started = true;
  } else {
    atabal.stop();
    marimbaChord.stop();
    started = false;
  }
}

function keyPressed() {
  if (key === 'a') {
    atabal.play();
  }

  if (key === 's'){
    marimbaChord.play();
  }
}
