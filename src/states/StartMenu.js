import Phaser from 'phaser';
import ButtonElement from '../sprites/ButtonElement';
export default class extends Phaser.State {
  init () {}

  preload () {
    
  }

  create () {
    this.game.stage.backgroundColor = "#FFFFFF"

    this.startButton = new Phaser.Button(this.game,16,0,'play', this.startGame, this);
    this.game.add.existing(this.startButton);
    

    this.widthButton = new ButtonElement({
        game: this.game,
        x:0,
        y:100,
        asset:'bluebubble',
        text: 'Width(8-16): ',
        variable: this.game.levelData.width,
        scalar:1,
        lowerBound:8,
        upperBound:20
    });
    this.game.add.existing(this.widthButton);
    
    this.shipSpeedButton = new ButtonElement({
        game: this.game,
        x:0,
        y:150,
        asset:'bluebubble',
        text: 'Ship Speed(50-500): ',
        variable: this.game.levelData.shipSpeed,
        scalar:50,
        lowerBound:50,
        upperBound:500
    });
    this.game.add.existing(this.shipSpeedButton);

    this.scrollSpeedButton = new ButtonElement({
        game: this.game,
        x:0,
        y:200,
        asset:'bluebubble',
        text: 'Scroll Speed(0-30): ',
        variable: this.game.levelData.scrollSpeedInitial,
        scalar:1,
        lowerBound:0,
        upperBound:30
    });
    this.game.add.existing(this.scrollSpeedButton);

    this.colorCountButton = new ButtonElement({
        game: this.game,
        x:0,
        y:250,
        asset:'bluebubble',
        text: 'Bubble Color Count(1-5): ',
        variable: this.game.levelData.bubbleColors.length,
        scalar:1,
        lowerBound:1,
        upperBound:5
    });
    this.game.add.existing(this.colorCountButton);

    

    this.heightButton = new ButtonElement({
        game: this.game,
        x:0,
        y:300,
        asset:'bluebubble',
        text: 'Bubble Starting Height(5-18): ',
        variable: this.game.levelData.bubbleStartingHeight,
        scalar:1,
        lowerBound:5,
        upperBound:18
    });
    this.game.add.existing(this.heightButton);

    this.shootSpeedButton = new ButtonElement({
        game: this.game,
        x:0,
        y:350,
        asset:'bluebubble',
        text: 'Bubble Shooting Speed(300-1000): ',
        variable: this.game.levelData.shootSpeed,
        scalar:50,
        lowerBound:300,
        upperBound:1000
    });
    this.game.add.existing(this.shootSpeedButton);


  }

  startGame(){
      this.game.levelData.width = this.widthButton.variable;
      this.game.levelData.shipSpeed = this.shipSpeedButton.variable;
      this.game.levelData.scrollSpeedInitial = this.scrollSpeedButton.variable;
      this.game.levelData.bubbleColors = this.game.levelData.allBubbleColors.slice(0,this.colorCountButton.variable);
      this.game.levelData.bubbleStartingHeight = this.heightButton.variable;
      this.game.levelData.shootSpeed = this.shootSpeedButton.variable;
      this.state.start('Game');
  }

}
