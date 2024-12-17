let mySound;
let mySound2;
let delay;
let filter;
let started = false;
let path = "https://cdn.glitch.global/0e6bb8f1-939f-4495-ad95-1fd455dc9d3f/SC_NM_marimba_panoramic_Emaj.wav?v=1729070717819";
let path2 = "https://cdn.glitch.global/0e6bb8f1-939f-4495-ad95-1fd455dc9d3f/SC_NM_150_perc_loop_tapping_mod.wav?v=1729070723625"
let img;
let button;
let paneo;


function preload() {
  mySound = loadSound(path);
  mySound2 = loadSound(path2);
  
  img = loadImage(
    "https://cdn.glitch.global/0e6bb8f1-939f-4495-ad95-1fd455dc9d3f/nicaMarimba.jpg?v=1729071233361"
  );
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  button = createButton("start - stop");
  button.position(width / 2, height / 2 + 325);

  //call start sound when the button is pressed.
  button.mousePressed(startSound);
  fft = new p5.FFT();


  //create modules and initialize parameters.
  delay = new p5.Delay();
  delay.delayTime(random(0.1, 10));
  delay.feedback(0.5);
  filter = new p5.LowPass();
  mySound.loop();
  mySound2.loop();

  //connect modules
  mySound.disconnect();
  filter.disconnect();
  mySound.connect(filter);
  filter.connect(delay);
  
  mySound2.disconnect();
  mySound2.connect(delay);

  imageMode(CENTER);
  img.filter(GRAY);
}

function draw() {
  // frameRate(13);
  background(0);
  img.resize(800, 580);
  image(img, width / 2, height / 2);
  
  mySound2.rate(random(0, 2));

  let frequency = map(mouseY, 0, height, 0, 20000);
  // let resonance = map(mouseY, height, 0, 5, 25);
  filter.res(5);
  filter.freq(frequency);
    
  let paneo = map(mouseX, 0, width, -1, 1);
  mySound.pan(paneo); 
  mySound2.pan(paneo);
  
}

function startSound() {
  if (!started) {
    mySound.play();
    mySound2.play();
    started = true;
  } else {
    mySound.stop();
    mySound2.stop();
    started = false;
  }
}
