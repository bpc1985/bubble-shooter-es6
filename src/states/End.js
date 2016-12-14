import Phaser from 'phaser';
import ButtonElement from '../sprites/ButtonElement';
import ToggleElement from '../sprites/ToggleElement';
export default class extends Phaser.State {
  init () {}

  preload () {
    
  }

  create () {
      this.game.stage.backgroundColor = "#000000"
      this.logoWidth = 640;
      this.logo = this.game.add.image(this.game.world.width/2,0,'gameover');
      this.logo.scale.setTo(0.8,0.8);
      this.logo.x-= this.logo.width/2;
      this.highscores = [];
      this.yourIndex = -1;
      this.fontSize = 24;
      this.ballCount = this.game.levelData.bubbleColors.length;
      this.scoreText = this.game.add.text(this.game.world.width/2,this.logo.height,"You traveled: " + this.game.levelData.score + 'km\n' ,{fill: '#FFFFFF',fontSize: this.fontSize,font:"Small Font Regular"});//,backgroundColor:'#FFFFFF'
      this.scoreText.x -= this.scoreText.width/2;
      this.addHighScoreText();
      this.menuButton = new Phaser.Button(this.game,0,this.game.world.height,'menu', this.showMenu, this);
      this.menuButton.y -= this.menuButton.height;
      this.game.add.existing(this.menuButton);
  }

  showMenu(){
      this.state.start('Menu');
  }

  addHighScoreText(){
      this.getHighScores()
      var str = 'Highscores: \n';
      this.highscoreText = this.game.add.text(this.scoreText.x,this.scoreText.y+this.scoreText.height,this.ballCount + '-bubble highscores:',{fill: '#FFFFFF',fontSize: this.fontSize,font:"Small Font Regular"});
      for(var i = 0; i<5;i++){
          //str = str + (i+1) +'. ' + this.highscores[i] +  'km\n';
          if(this.yourIndex === i){
            this.game.add.text(this.scoreText.x-30,this.highscoreText.y+this.highscoreText.height+(i)*this.highscoreText.height,'>',{fill: '#FFFFFF',fontSize: this.fontSize,font:"Small Font Regular"});
            this.game.add.text(this.scoreText.x,this.highscoreText.y+this.highscoreText.height+(i)*this.highscoreText.height,(i+1) +'. ' + this.highscores[i] +  'km',{fill: '#FFFFFF',fontSize: this.fontSize,font:"Small Font Regular"});
          }else{
            this.game.add.text(this.scoreText.x,this.highscoreText.y+this.highscoreText.height+(i)*this.highscoreText.height,(i+1) +'. ' + this.highscores[i] +  'km',{fill: '#FFFFFF',fontSize: this.fontSize,font:"Small Font Regular"});
          }
          
      }

      return str;
  }

  getHighScores(){
      for(var i = 0; i<5;i++){
          this.highscores[i] = localStorage.getItem(this.ballCount + 'highscore' + i) ? parseInt(localStorage.getItem(this.ballCount + 'highscore' + i)) : 0;
      }
      this.highscores[5] = this.game.levelData.score;
      this.highscores.sort(function(a, b){return b-a});
      this.yourIndex = this.highscores.indexOf(this.game.levelData.score);

      for(var i = 0; i<5;i++){
          localStorage.setItem(this.ballCount + 'highscore' + i, this.highscores[i]);
      }

      //for(var i = 1; i<=5;i++){
      //    if(this.game.levelData.score >= this.highscores[i]){
      //        
      //    }
      //}

  }
}
