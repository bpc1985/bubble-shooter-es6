/* globals __DEV__ */
import Phaser from 'phaser';
import Bubble from '../sprites/Bubble';
import Ship from '../sprites/Ship';
import BubbleOrder from '../sprites/BubbleOrder';
import Grid from '../sprites/Grid';
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
    //this.background = this.game.add.image(this.leftBound,0,'background');


    //The ship's left and the right boundary are set bubbleRadius/2 inwards to avoid shooting bubbles into the walls
    this.ship = new Ship({
      game: this.game,
      x: this.centerBound,
      y: this.game.world.height - this.bubbleRadius,
      asset: 'ship',
      rightBound:this.rightBound,
      leftBound:this.leftBound,
      bubbleColors: this.bubbleColors
    });
    this.game.add.existing(this.ship);


    this.bubblesOnGrid = [];

    this.bubbleOrder = new BubbleOrder({
      game: this.game,
      //x:this.rightBound + this.bubbleRadius,
      //y:this.bubbleRadius * 4,
      //x:this.ship.body.center.x,
      //y:this.ship.body.center.y-32,
      x:0,
      y:0,
      asset:'bubbleorder',
      ship:this.ship
    });
    //this.game.add.existing(this.bubbleOrder);
    this.ship.addChild(this.bubbleOrder);
    
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
    

    this.score = 0;
    this.scoreText = this.game.add.text(this.rightBound+4,100,"Asd",{fill: '#FFFFFF',fontSize: 20});
    
    //Create the shooting callback
    this.game.input.activePointer.leftButton.onDown.add(this.mouseDown,this);
  }
  update() {

    this.scoreText.setText('Distance' + '\n' +  Math.floor(this.bubbleGrid.body.y-this.game.world.height));
    
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
      null,
      this
    );
  }

  mouseDown(){
     this.ship.shoot();
     this.bubbleOrder.updateOrder();
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
      var newBubble = this.bubbleGrid.snapToGrid(activeBubble,gridBubble);
      this.bubbleGrid.onHit(newBubble);
      this.ship.readyGun();
      
    }
  }

  //Called when the ship collides with the bubbles on the grid
  shipCollision(ship, gridBubble) {
      this.game.input.activePointer.leftButton.onDown.remove(this.mouseDown,this);
      this.state.start('StartMenu');
    
  }
  



}
