/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Bubble from '../sprites/Bubble'
import Ship from '../sprites/Ship'
import {setResponsiveWidth} from '../utils'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
      //These bounds probably need something more intelligent. These are just some made up values
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.bubbleRadius = 32;
      this.grid = {width: 20, height: 15};
      this.leftBound = 50;
      this.rightBound = this.leftBound + this.grid.width * this.bubbleRadius;

      //DEBUG lines
      this.leftLine = new Phaser.Line(this.leftBound,0,this.leftBound,this.game.world.height);
      this.rightLine = new Phaser.Line(this.rightBound,0,this.rightBound,this.game.world.height);
      this.bottomLine = new Phaser.Line(this.leftBound,this.game.world.height - 2* this.bubbleRadius,this.rightBound,this.game.world.height - 2* this.bubbleRadius);
      this.centerLine = new Phaser.Line(this.leftBound +  (this.rightBound - this.leftBound)/2, this.game.world.height - 2* this.bubbleRadius, this.leftBound +  (this.rightBound - this.leftBound)/2, this.game.world.height);

      //The ship's left and the right boundary are set bubbleRadius/2 inwards to avoid shooting bubbles into the walls
      this.ship = new Ship({game: this.game,
        x: this.leftBound +  (this.rightBound - this.leftBound)/2,
        y: this.game.world.height - 1.5* this.bubbleRadius,
        asset: 'redbubble',
        rightBound:this.rightBound - this.bubbleRadius/2,
        leftBound:this.leftBound + this.bubbleRadius/2

      });
      this.game.add.existing(this.ship);

      this.bubble = null;
      this.makeActiveBubble();

      this.bubblesOnGrid = [];
      this.makeGrid();
  }
  update (){
      //Move with A and D.
      //Shoot with left mouse button.

      //Ship movement
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.A))
      {
          this.ship.move('left');
      }
      else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
      {
          this.ship.move('right');
      }
      else{
          this.ship.move('nowhere');
      }
      //Shooting the bubble
      if(this.game.input.activePointer.leftButton.isDown && this.bubble != null){
          this.bubble.shoot();
      }

      //Check collision between the bubble that is being shot and the bubbles on the grid
      this.game.physics.arcade.overlap(this.bubble,this.bubblesOnGrid,this.bubbleCollision,null,this);


  }

  render () {
    if (__DEV__) {
      //DEBUG LINES
      this.game.debug.geom(this.leftLine,"#000000");
      this.game.debug.geom(this.bottomLine,"#000000");
      this.game.debug.geom(this.rightLine,"#000000");
      this.game.debug.geom(this.centerLine,"#000000");

    }
  }

  //Gets called when the bubble that is currently being shot hits one of the bubbles on the grid.
  bubbleCollision(activeBubble,gridBubble){
      gridBubble.kill();
      activeBubble.kill();
      this.makeActiveBubble();

  }

  //Makes a grid of bubbles
  makeGrid(){
      //Creating some targets
      //Not Final
      for(var j=0;j<3;j++){
          for(var i = 0; i<20;i++){
          this.bubblesOnGrid[j * 20 +i] = new Bubble({game: this.game,
            x :this.leftBound + i*this.bubbleRadius + this.bubbleRadius/2,
            y:400+j*this.bubbleRadius,
            asset:'bluebubble',
            rightBound: this.rightBound,
            leftBound: this.leftBound});
          this.bubblesOnGrid[j * 20 +i].shot = true;
          this.game.add.existing(this.bubblesOnGrid[j * 20 +i]);
        }
      }



  }
  //Creates a shootable bubble in ships position
  makeActiveBubble(){
      this.bubble = new Bubble({game: this.game,
        x :this.ship.body.x,
        y: this.ship.body.y,
        asset:'bluebubble',
        rightBound: this.rightBound,
        leftBound: this.leftBound,
        ship:this.ship});
      this.game.add.existing(this.bubble);
  }



}
