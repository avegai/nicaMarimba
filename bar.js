function Bar(id) {
    this.display = function() {
    noStroke();
    fill(clr[id]);
    rect(xBar[id], 50, windowWidth / numBars, windowHeight);
    }
    this.played = function() {
        if(mouseY > 50 && mouseY < windowHeight && mouseX > xBar[id] && mouseX < xBar[id] + windowWidth / numBars){
            marimbaChord.play();
            marimbaChord.setVolume(0.5);
        }
    }
}