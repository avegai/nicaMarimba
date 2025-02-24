let marimbaBarsSketch = (p) => {
  let bars = [];
  let sounds = [];
  let barColors = [];
  let hoverColors = [];
  let numBars = 7; // Number of marimba bars

  p.preload = () => {
    for (let i = 0; i < numBars; i++) {
      sounds[i] = p.loadSound(`assets/SC_NM_marimba_single_note_${i + 1}.wav`);
    }
  };

  p.setup = () => {
    let canvas = p.createCanvas(p.min(p.windowWidth * 0.5, 500), 300);
    canvas.parent("marimba-container"); // Attach to the centered div
    let barWidth = p.width / numBars;
    let barHeight = 40;

    for (let i = 0; i < numBars; i++) {
      let x = i * barWidth + barWidth / 2;
      let y = p.height / 2;
      bars.push(new MarimbaBar(p, x, y, barWidth - 10, barHeight, sounds[i]));

      // Define colors
      barColors[i] = p.color(139, 69, 19); // Wood-like color
      hoverColors[i] = p.color(200, 120, 60); // Lighter wood when hovered
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.min(p.windowWidth * 0.8, 700), 300);
  };

  p.draw = () => {
    p.background("#E8E2D4"); // Warm background color

    // Draw marimba bars
    for (let bar of bars) {
      bar.display();
    }
  };

  class MarimbaBar {
    constructor(p, x, y, w, h, sound) {
      this.p = p;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.sound = sound;
      this.isHovered = false;
    }

    display() {
      // Check hover state
      this.isHovered = this.isMouseOver();

      // Set color
      this.p.fill(this.isHovered ? hoverColors[bars.indexOf(this)] : barColors[bars.indexOf(this)]);
      this.p.stroke(80, 40, 20);
      this.p.strokeWeight(3);
      this.p.rectMode(this.p.CENTER);
      this.p.rect(this.x, this.y, this.w, this.h, 10);

      if (this.isHovered && !this.sound.isPlaying()) {
        this.sound.play();
      }
    }

    isMouseOver() {
      return (
        this.p.mouseX > this.x - this.w / 2 &&
        this.p.mouseX < this.x + this.w / 2 &&
        this.p.mouseY > this.y - this.h / 2 &&
        this.p.mouseY < this.y + this.h / 2
      );
    }
  }
};

// Attach the sketch to a specific container
new p5(marimbaBarsSketch, "sketch-container-2");