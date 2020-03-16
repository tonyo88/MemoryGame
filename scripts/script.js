class AudioController{
  constructor() {
     this.bgMusic = new Audio("assets/sounds/bensound-creepy.mp3");
     this.flipSound = new Audio("assets/sounds/button-25.mp3");
     this.matchSound = new Audio("assets/sounds/Oh-yeah-sound-effect.mp3");
     this.victorySound = new Audio("assets/sounds/Cheering-SoundBible.com-1115515042.mp3");
     this.finalVictorySound = new Audio ("assets/sounds/bensound-creativeminds.mp3");
     this.gameOverSound = new Audio ("assets/sounds/Oh-no-sound-effect.mp3");
     this.bgMusic.volume = 0.4;
     this.bgMusic.loop = true;
     this.flipSound.volume = 0.2;
     this.matchSound.volume = 0.2;
     this.victorySound.volume = 0.3;
     this.finalVictorySound.volume = 0.4;
     this.gameOverSound.volume = 0.2;

  }
  startMusic() {
      this.stopFinalVictory();
      this.bgMusic.play();
  }
  stopMusic() {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
  }
  
  flip() {
      this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  finalVictory(){
      this.finalVictorySound.play();
  }
  stopFinalVictory(){
    this.finalVictorySound.pause();
    this.finalVictorySound.currentTime = 0;
}
  victory() {
      this.stopMusic();
      this.victorySound.play();
      setTimeout(() => {
        this.finalVictory();
      }, 3000);
  }
  gameOver() {
      this.stopMusic();
      this.gameOverSound.play();
  }
    stopSoundTrack() {
      this.bgMusic.pause();

  }
  
}


class MixOrMatch {
    constructor(totalTime, cards) {
       this.cardsArray = cards;
       this.totalTime = totalTime;
       this.timeRemaining = totalTime;
       this.timer = document.getElementById("time-remainig");
       this.ticker = document.getElementById("flips");
       this.audioController = new AudioController();       
    }

    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout( () =>{          
          this.audioController.startMusic();
          this.shuffleCards();
          this.countDown = this.startCountDown();
          this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;

    }

    hideCards() {
        this.cardsArray.forEach(card => {
          card.classList.remove("visible");
          card.classList.remove("matched");
        })
    }

    flipCard(card) {

       if(this.canFlipCard(card)){
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck){
            this.checkForCardMatch(card);
            } else{
            this.cardToCheck = card;
            }
        
       }
    }

    checkForCardMatch(card) {

       if(this.getCardType(card) === this.getCardType(this.cardToCheck)){
           this.cardMatch(card, this.cardToCheck);
       } else{
           this.cardMisMatch(card, this.cardToCheck);
       }

       this.cardToCheck = null;

    }

    cardMatch(card1, card2) {
      this.matchedCards.push(card1);
      this.matchedCards.push(card2);
      card1.classList.add("matched");
      card2.classList.add("matched");
      this.audioController.match();
      if(this.matchedCards.length === this.cardsArray.length){
          this.victory();
      }
    }

    cardMisMatch(card1, card2) {
       this.busy = true;
       setTimeout(() => {
         card1.classList.remove("visible");
         card2.classList.remove("visible");
         this.busy = false;
       }, 1000);
    }

    getCardType(card){
      return card.getElementsByClassName("card-value")[0].src;
    }



    startCountDown() {
       return setInterval(() =>{
         this.timeRemaining--;
         this.timer.innerText = this.timeRemaining;
         if(this.timeRemaining === 0) {
             this.gameOver();
         }
       }, 1000);
    }

    gameOver () {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById("game-over-text").classList.add("visible");
    }

    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById("victory-text").classList.add("visible");
        this.hideCards();
    }
   
      stopAllMusic(){
      this.audioController.stopSoundTrack();
    }

    shuffleCards() {
    for(let i = this.cardsArray.length - 1; i > 0; i--) {
       let randomIndex = Math.floor(Math.random() * (i+1));
       this.cardsArray[randomIndex].style.order = i;
       this.cardsArray[i].style.order = randomIndex;

      }
    }

    canFlipCard(card) {
       return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

   function ready(){
    let overlays = Array.from(document.getElementsByClassName("overlay-text"));
    let cards = Array.from(document.getElementsByClassName("cards"));
    let soundButton = document.getElementById("sound-button");
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener("click", () => {
            overlay.classList.remove("visible");
            game.startGame();
        });
    });
    cards.forEach(card => {
      card.addEventListener("click", () =>{
          game.flipCard(card);
      });
    });

    
    soundButton.addEventListener("click", () => {
      
        let icon = document.getElementById('icon');

        if (icon.classList.contains('fa-volume-off')) {
        icon.classList.remove('fa-volume-off');
        icon.classList.add('fa-volume-up');
        game.stopAllMusic();
        } else {
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-off');
        game.audioController.startMusic();
        }
      
    });
}

if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", ready());
}else{
    ready();
}

