import Phaser from 'phaser';
import ButtonElement from '../sprites/ButtonElement';
import ToggleElement from '../sprites/ToggleElement';
export default class extends Phaser.State {
  init () {}

  preload () {
    
  }

  create () {
     
       
        this.game.levelData.width = localStorage.getItem('width') ? parseInt(localStorage.getItem('width')) : 15;
        this.game.levelData.shootSpeed= localStorage.getItem('shootSpeed') ? parseInt(localStorage.getItem('shootSpeed')) : 700;
        this.game.levelData.shipSpeed= localStorage.getItem('shipSpeed') ? parseInt(localStorage.getItem('shipSpeed')) : 300;
        this.game.levelData.scrollSpeedInitial= localStorage.getItem('scrollSpeedInitial') ? parseInt(localStorage.getItem('scrollSpeedInitial')) : 20;
        this.game.levelData.scrollSpeedTarget= localStorage.getItem('scrollSpeedTarget') ? parseInt(localStorage.getItem('scrollSpeedTarget')) : 30;
        this.game.levelData.scrollSpeedTotalTime= localStorage.getItem('scrollSpeedTotalTime') ? parseInt(localStorage.getItem('scrollSpeedTotalTime')) : 100000;
        this.game.levelData.scrollSpeedAcceleration= localStorage.getItem('scrollSpeedAcceleration') ? parseInt(localStorage.getItem('scrollSpeedAcceleration')) : 0;
        
        //bubbleColors: ['blue', 'red','green'],
        //allBubbleColors: ['blue', 'red','green','yellow','purple'],
        this.game.levelData.bubbleStartingHeight= localStorage.getItem('bubbleStartingHeight') ? localStorage.getItem('bubbleStartingHeight') : 12; //The higher the number the higher the bubbles will start.Measured in tiles rather than raw pixels. MAX: Floor(this.game.world.height/bubbleRadius)
        this.game.levelData.disableTween= localStorage.getItem('disableTween') ? localStorage.getItem('disableTween') : false,
        //score: 0,
        //boosterSpeed: 200,
        //boosterAccelerationModifier: 2,
        //boosterTime:1,
        this.game.levelData.volume=localStorage.getItem('volume') ? localStorage.getItem('volume') : 0.05,
        //musicVolume:1
      
    
    this.game.stage.backgroundColor = "#FFFFFF"

    this.startButton = new Phaser.Button(this.game,16,0,'play', this.startGame, this);
    this.game.add.existing(this.startButton);
    

    this.widthButton = new ButtonElement({
        game: this.game,
        x:0,
        y:100,
        asset:'bluebubble',
        text: 'Width(8-20): ',
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
        y:400,
        asset:'bluebubble',
        text: 'Scroll Speed(0-30): ',
        variable: this.game.levelData.scrollSpeedInitial,
        scalar:1,
        lowerBound:0,
        upperBound:30
    });

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

    this.maxSpeedButton = new ButtonElement({
        game: this.game,
        x:0,
        y:450,
        asset:'bluebubble',
        text: 'Max scroll speed(0-40): ',
        variable: this.game.levelData.scrollSpeedTarget,
        scalar:1,
        lowerBound:0,
        upperBound:40
    });
    this.game.add.existing(this.maxSpeedButton);

    this.maxTimeButton = new ButtonElement({
        game: this.game,
        x:0,
        y:500,
        asset:'bluebubble',
        text: 'Total time to reach max speed in milliseconds (50000-500000): ',
        variable: this.game.levelData.scrollSpeedTotalTime,
        scalar:10000,
        lowerBound:50000,
        upperBound:500000
    });
    this.game.add.existing(this.maxTimeButton);

    this.tweenToggleButton = new ToggleElement({
        game: this.game,
        x:0,
        y:550,
        asset:'bluebubble',
        text: 'Disable Bubble Animations (true - false): ',
        variable: this.game.levelData.disableTween,
        scalar:1,
        lowerBound:1,
        upperBound:1
    });
    this.game.add.existing(this.tweenToggleButton);


    this.volumeButton = new ButtonElement({
        game: this.game,
        x:0,
        y:200,
        asset:'bluebubble',
        text: 'Volume(0-1) ',
        variable: this.game.levelData.volume*100,
        scalar:5,
        lowerBound:0,
        upperBound:100
    });
    this.game.add.existing(this.colorCountButton);


    

  }

  startGame(){
      this.game.levelData.width = this.widthButton.variable;
      localStorage.setItem('width',this.widthButton.variable);

      this.game.levelData.shipSpeed = this.shipSpeedButton.variable;
      this.game.levelData.scrollSpeedInitial = this.scrollSpeedButton.variable;
      this.game.levelData.bubbleColors = this.game.levelData.allBubbleColors.slice(0,this.colorCountButton.variable);
      this.game.levelData.bubbleStartingHeight = this.heightButton.variable;
      this.game.levelData.shootSpeed = this.shootSpeedButton.variable;
      this.game.levelData.scrollSpeedTarget = this.maxSpeedButton.variable;
      this.game.levelData.scrollSpeedTotalTime = this.maxTimeButton.variable;
      this.game.levelData.disableTween = this.tweenToggleButton.variable;
      this.game.levelData.volume = this.volumeButton.variable*0.01;
      localStorage.setItem('volume',this.volumeButton.variable*0.01);
      this.state.start('Game');
  }

}
