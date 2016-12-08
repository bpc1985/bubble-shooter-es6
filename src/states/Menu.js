import Phaser from 'phaser';
import ButtonElement from '../sprites/ButtonElement';
import ToggleElement from '../sprites/ToggleElement';
export default class extends Phaser.State {
  init () {}

  preload () {
    
  }

  create () {
      this.game.levelData.volume=localStorage.getItem('volume') ? localStorage.getItem('volume') : 0.05;
      this.colorCount = localStorage.getItem('colors') ? parseInt(localStorage.getItem('colors')) : 3;
      this.game.stage.backgroundColor = "#000000"
      this.logoWidth = 640;
      this.logo = this.game.add.image(this.game.world.width/2-this.logoWidth/2,0,'logo');


      this.controlsButton = new Phaser.Button(this.game,0,this.logo.height,'play', this.showControls, this);
      this.game.add.existing(this.controlsButton);

      this.missionButton = new Phaser.Button(this.game,this.game.world.width,this.logo.height,'play', this.showMission, this);
      this.missionButton.x -= this.missionButton.width;
      this.game.add.existing(this.missionButton);

      this.startButton = new Phaser.Button(this.game,this.game.world.width/2,this.logo.height,'play', this.startGame, this);
      this.startButton.x -= this.startButton.width/2;
      this.game.add.existing(this.startButton);

      this.customButton = new Phaser.Button(this.game,this.game.world.width,this.game.world.height,'play', this.showCustom, this);
      this.customButton.x -= this.customButton.width;
      this.customButton.y -= this.customButton.height;
      
      this.game.add.existing(this.customButton);

      this.volumeButton = new ButtonElement({
        game: this.game,
        x:-64,
        y:this.game.world.height-30,
        asset:'bluebubble',
        text: 'Volume: ',
        variable: Math.round(this.game.levelData.volume*100),
        scalar:5,
        lowerBound:0,
        upperBound:100
    });
    this.game.add.existing(this.volumeButton);

    this.colorCountButton = new ButtonElement({
        game: this.game,
        x:this.startButton.x-80,
        y:this.startButton.y+this.startButton.height+4,
        asset:'bluebubble',
        text: '#Colors: ',
        variable: this.colorCount,
        scalar:1,
        lowerBound:3,
        upperBound:5,
        rightMargin:8
    });
    
    this.game.add.existing(this.colorCountButton);

  }

  showControls(){
      this.updateVariables();
      this.state.start('Controls');
  }

  showMission(){
      this.updateVariables();
      this.state.start('Mission');
  }

  startGame(){
      this.updateVariables();      
      this.state.start('Game');
  }

  updateVariables(){
      this.game.levelData.score = 0;
      this.game.levelData.volume = this.volumeButton.variable*0.01;
      this.game.levelData.bubbleColors = this.game.levelData.allBubbleColors.slice(0,this.colorCountButton.variable);
      if(this.colorCountButton.variable === 3){
          this.game.levelData.scrollSpeedInitial = 15;
          this.game.levelData.scrollSpeedTarget = 30;
          this.game.levelData.scrollSpeedTotalTime = 100000;
      }else if(this.colorCountButton.variable === 4){
          this.game.levelData.scrollSpeedInitial = 5;
          this.game.levelData.scrollSpeedTarget = 15;
          this.game.levelData.scrollSpeedTotalTime = 100000;

      }else if(this.colorCountButton.variable === 5){
          this.game.levelData.scrollSpeedInitial = 5;
          this.game.levelData.scrollSpeedTarget = 6;
          this.game.levelData.scrollSpeedTotalTime = 100000;
      }


      localStorage.setItem('colors',this.colorCountButton.variable);
      localStorage.setItem('volume',this.volumeButton.variable*0.01);

  }

  showCustom(){
      this.state.start('StartMenu');
  }
}
