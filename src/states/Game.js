/* globals __DEV__ */
import Phaser from 'phaser';
import Bubble from '../sprites/Bubble';
import Ship from '../sprites/Ship';
import BubbleOrder from '../sprites/BubbleOrder';
import Grid from '../sprites/Grid';
import Booster from '../sprites/Booster';
import {setResponsiveWidth} from '../utils';

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); } //Prevenst mouse 2 context menu
    //LEVEL BOUNDARIES
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bubbleRadius = this.game.levelData.bubbleRadius;
    //DELETEthis.grid = {width: 8, height: 15};
    this.leftBound = this.game.levelData.bubbleRadius;
    this.rightBound = this.leftBound + this.game.levelData.width * this.bubbleRadius;
    this.centerBound = this.leftBound + (this.rightBound - this.leftBound) / 2;
    
    //DEBUG lines
    this.leftLine = new Phaser.Line(this.leftBound, 0, this.leftBound, this.game.world.height);
    this.rightLine = new Phaser.Line(this.rightBound, 0, this.rightBound, this.game.world.height);
    //this.bottomLine = new Phaser.Line(this.leftBound, this.game.world.height - 2*this.bubbleRadius, this.rightBound, this.game.world.height - 2* this.bubbleRadius);
    this.centerLine = new Phaser.Line(this.centerBound, this.game.world.height - 2* this.bubbleRadius, this.centerBound, this.game.world.height);
    this.leftSide = this.game.add.sprite(this.leftBound-4,0,'side');
    this.rightSide = this.game.add.sprite(this.rightBound,0,'side');
    //BACKGROUND COLOR AND BUBBLE COLOR
    this.bubbleColors = this.game.levelData.bubbleColors;
    this.game.stage.backgroundColor = "#000000"
    this.background = this.game.add.image(this.leftBound,0,'background');
    this.background.scale.setTo((this.rightBound-this.leftBound)/this.background.width,1);
    //this.statImage = this.game.add.image(this.rightBound+4,100,'score');
    //Sounds
    this.wallHitSound = this.game.add.audio('wallhit',this.game.levelData.volume*0.1);
    this.bubbleHitSound = this.game.add.audio('bubblehit',this.game.levelData.volume*0.1);
    this.backgroundMusic = this.game.add.audio('bg1',this.game.levelData.volume,true);
    this.shipExplosion = this.game.add.audio('shipexplosion',this.game.levelData.volume*0.1,false);
    //The ship's left and the right boundary are set bubbleRadius/2 inwards to avoid shooting bubbles into the walls
    this.ship = new Ship({
      game: this.game,
      x: this.centerBound-this.bubbleRadius,
      //y: this.game.world.height - this.bubbleRadius,
      y:this.game.world.height,
      asset: 'ship',
      rightBound:this.rightBound,
      leftBound:this.leftBound,
      bubbleColors: this.bubbleColors,
      wallHitSound:this.wallHitSound,
      bubbleHitSound: this.bubbleHitSound
    });
    this.game.add.existing(this.ship);


    this.bubblesOnGrid = [];

    //this.bubbleOrder = new BubbleOrder({
    //  game: this.game,
    //  //x:this.rightBound + this.bubbleRadius,
    //  //y:this.bubbleRadius * 4,
    //  //x:this.ship.body.center.x,
    //  //y:this.ship.body.center.y-32,
    //  x:0,
    //  y:0,
    //  asset:'bubbleorder',
    //  ship:this.ship
    //});
    ////this.game.add.existing(this.bubbleOrder);
    //this.ship.addChild(this.bubbleOrder);
    
    this.bubbleGrid= new Grid({
      game:this.game,
      x:this.leftBound,
      y:this.game.world.height,
      asset:'redbubble',
      leftBound:this.leftBound,
      rightBound:this.rightBound,
      width:this.game.levelData.width,
      startingBubbleY:this.game.levelData.bubbleStartingHeight,
      bubbleColors:this.bubbleColors
    });
    this.game.add.existing(this.bubbleGrid);
    

   
    this.score = this.game.levelData.score;  

    this.scoreText = this.game.add.text(this.rightBound+8,140,"Asd",{fill: '#FFFFFF',fontSize: 30,font:"Small Font Regular"});

    
   
    
    //Create the shooting callback
    this.game.input.activePointer.leftButton.onDown.add(this.mouseDown,this);
    this.spacebar = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    this.esc = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC);
    this.esc.onDown.add(this.showMenu,this);

    this.spacebar.onDown.add(this.switchColor,this);

    if(this.game.levelData.accelerationToggle === false){
      this.game.time.events.add(Phaser.Timer.SECOND * this.game.levelData.boosterTime, this.dropBooster, this);
      //this.booster = new Booster({
      //  game: this.game,
      //  x:this.centerBound,
      //  y:-this.bubbleRadius,
      //  asset: 'redbubble',
      //  leftBound: this.leftBound,
      //  rightBound: this.rightBound
      //});
      
    }
    this.backgroundMusic.play();
    
  }
  update() {
    
    this.scoreText.setText('Distance' + '\n'+Math.floor(this.score + this.bubbleGrid.body.y-this.game.world.height)+ ' km');//'' + '\n'
    
    //Move with A and D.
    //Shoot with left mouse button.
    //Ship movement
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      this.ship.move('left');
    } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      this.ship.move('right');
    } else {
      this.ship.move('nowhere');
    }

    //Check collision between the bubble that is being shot and the bubbles on the grid
    this.game.physics.arcade.overlap(
      this.ship.bubble,
      this.bubbleGrid.collisionGroup,
      this.bubbleCollision,
      null,
      this
    );
    //Ship Collision with bubbles
    this.game.physics.arcade.overlap(
      this.ship,
      this.bubbleGrid.collisionGroup,
      this.shipCollision,
      this.shipCollisionCheck,
      this
    );
    if(this.game.levelData.accelerationToggle === false){
      this.game.physics.arcade.overlap(
        this.ship,
        this.booster,
        this.boosterCollision,
        this.shipCollisionCheck,
        this
      );
    }
  }

  mouseDown(){
     this.ship.shoot();
     //this.bubbleOrder.updateOrder();
  }

  render () {
    
      //DEBUG LINES
      //this.game.debug.geom(this.leftLine, "#FFFFFF");
      //this.game.debug.geom(this.bottomLine, "#000000");
      //this.game.debug.geom(this.rightLine, "#FFFFFF");
      //this.game.debug.geom(this.centerLine, "#000000");
      //this.game.debug.geom(this.testLine1, "#000000");
      //this.game.debug.geom(this.testLine2, "#000000");
    
  }

  //Gets called when the bubble that is currently being shot hits one of the bubbles on the grid.
  bubbleCollision(activeBubble, gridBubble) {
    if(activeBubble.alive){
      if(activeBubble.bubbleHitSound != undefined){
        activeBubble.bubbleHitSound.play();
      }
      var newBubble = this.bubbleGrid.snapToGrid(activeBubble,gridBubble);
      this.bubbleGrid.onHit(newBubble);
      this.ship.readyGun();
      
    }
  }

  //Called when the ship collides with the bubbles on the grid
  shipCollision(ship, gridBubble) {
      this.shipExplosion.play();
      this.backgroundMusic.pause();
      this.backgroundMusic.onFadeComplete.add(this.backgroundMusic.pause,this);
      this.game.input.activePointer.leftButton.onDown.remove(this.mouseDown,this);
      this.game.levelData.score = Math.round(this.score + this.bubbleGrid.body.y-this.game.world.height);

      this.state.start('End');
    
  }

  showMenu(){
    this.backgroundMusic.pause();
    this.game.input.activePointer.leftButton.onDown.remove(this.mouseDown,this);
    this.game.levelData.score = 0;

    this.state.start('Menu');

  }
  boosterCollision(ship,booster){
    booster.popIn();
    ship.flyAway();
    var x  = this.ship.body.x-this.ship.width;
    // 
    this.shipTween = this.game.add.tween(this.ship.body.position).to( {x: this.centerBound-this.ship.width, y: -this.ship.height }, 500, Phaser.Easing.Linear.None, true);
    this.game.add.tween(this.ship.scale).to( { x: 1.5, y:1.5 }, 500, Phaser.Easing.Linear.None, true)
    this.shipTween.onComplete.add(this.levelTransition,this);


  }
  shipCollisionCheck(ship, booster){
    if(ship.noCollide === true){
      return false;
    }else {
      return true;
    }
  }

  levelTransition(){
      this.game.input.activePointer.leftButton.onDown.remove(this.mouseDown,this);
      this.game.levelData.score = this.score + this.bubbleGrid.body.y-this.game.world.height;
      this.game.levelData.scrollSpeedInitial += this.game.levelData.boosterAccelerationModifier;
      this.state.start('Game');
  }

  switchColor(){
    this.ship.switchColor();
  }

  dropBooster(){
    this.booster = new Booster({
        game: this.game,
        x:this.leftBound+this.bubbleRadius + Math.random()*(this.rightBound-this.leftBound-this.bubbleRadius),
        y:-this.bubbleRadius,
        asset: 'purplebubble',
        leftBound: this.leftBound,
        rightBound: this.rightBound
      });
    this.game.add.existing(this.booster);
  }  



}
