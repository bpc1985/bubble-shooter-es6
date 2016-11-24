import Phaser from 'phaser';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, rightBound, leftBound, ship,color,gridPosition}) {
    super(game, x, y, asset);

    this.game = game;
    this.anchor.setTo(0.5,0.5);
    this.shot = false;
    this.game.physics.arcade.enable(this);
    this.margin = 0;
    this.body.setCircle(this.bubbleRadius/2-this.margin);
    this.rightBound = rightBound;
    this.leftBound = leftBound;
    this.ship = ship;
    this.color = color;
    this.gridPosition = gridPosition;
    this.checked = false;
    this.killCheck = false;
  }

  update () {
    if(this.body.right+this.margin >= this.rightBound){
      this.body.velocity.x = -this.body.velocity.x;
    }

    if(this.body.left-this.margin <= this.leftBound){
      this.body.velocity.x = -this.body.velocity.x;
    }
    if(this.body.top > this.game.world.height){
      this.kill();
    }
}
  popIn(){
    this.killCheck = true;
    this.tween = this.game.add.tween(this.scale).to( { x: 0, y: 0 }, 70, Phaser.Easing.Linear.None, true);
    this.tween.onComplete.add(this.kill,this);
  }

  getStatus(){
    if(this.checked === false && this.killCheck === false){//this.alive && 
      return true;
    }
    else return false;
  }


}
