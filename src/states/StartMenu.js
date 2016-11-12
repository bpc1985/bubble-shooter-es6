import Phaser from 'phaser';
export default class extends Phaser.State {
  init () {}

  preload () {
    
  }

  create () {
    this.game.levelData = {
        bubbleRadius: 32, //Bubble radius actually means bubble diameter but it is referenced everywhere as the radius.
        width: 10,
        shootSpeed: 700,
        shipSpeed: 200,
        scrollSpeedInitial: 10,
        scrollSpeedAcceleration: 0,
        bubbleColors: ['blue', 'red','green','yellow'],
        allBubbleColors: ['blue', 'red','purple','green','yellow'],
        bubbleStartingHeight: 16 //The higher the number the higher the bubbles will start.Measured in tiles rather than raw pixels. MAX: Floor(this.game.world.height/bubbleRadius)

        };
    this.startButton = new Phaser.Button(this.game,100,100,'bluebubble', this.startGame, this);
    this.game.add.existing(this.startButton);


    this.widthText = this.game.add.text(150,200,"Width: " + this.game.levelData.width,{fill: '#000000',fontSize: 20});

    this.widthMinusButton = new Phaser.Button(this.game,100,200,'minus', this.minusGridWidth, this);
    this.game.add.existing(this.widthMinusButton);

    this.widthPlusButton = new Phaser.Button(this.game,300,200,'plus', this.plusGridWidth, this);
    this.game.add.existing(this.widthPlusButton);

  }

  startGame(){
      
      this.state.start('Game');
  }

  minusGridWidth(){
      this.game.levelData.width -= 1;
      this.widthText.setText("Width: " + this.game.levelData.width);
  }

  plusGridWidth(){
      this.game.levelData.width += 1;
      this.widthText.setText("Width: " + this.game.levelData.width);
  }
}
