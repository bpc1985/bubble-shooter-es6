import Phaser from 'phaser';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, rightBound, leftBound, ship}) {
    super(game, x, y, asset);

    this.game = game;
    this.anchor.setTo(0.5, 0.5);
    this.shot = false;
    this.game.physics.arcade.enable(this);
    this.body.setCircle(16);
    this.rightBound = rightBound;
    this.leftBound = leftBound;
    this.ship = ship;
    this.maxSpeed = 700;
  }

  update () {
    if(this.body.right >= this.rightBound){
      this.body.velocity.x = -this.body.velocity.x;
    }

    if(this.body.left <= this.leftBound){
      this.body.velocity.x = -this.body.velocity.x;
    }
}


}
