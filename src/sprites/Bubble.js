import Phaser from 'phaser';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, rightBound, leftBound, ship,color,gridPosition}) {
    super(game, x, y, asset);

    this.game = game;
    this.anchor.setTo(0.5,0.5);
    this.shot = false;
    this.game.physics.arcade.enable(this);
    this.margin = 2;
    this.body.setCircle(16-this.margin);
    this.rightBound = rightBound;
    this.leftBound = leftBound;
    this.ship = ship;
    this.color = color;
    this.gridPosition = gridPosition;
    this.checked = false;
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


}
