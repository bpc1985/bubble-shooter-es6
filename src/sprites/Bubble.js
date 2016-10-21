import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, rightBound, leftBound,ship}) {
    super(game, x, y, asset)

    this.game = game
    this.anchor.setTo(0.5,0.5)
    this.shot = false;
    this.game.physics.arcade.enable(this);
    this.body.setCircle(16);
    //Maybe something more intelligent needed with these values, for example when we have a grid object we can give it or something.
    this.rightBound = rightBound;
    this.leftBound = leftBound;
    this.ship = ship;
    this.maxSpeed = 700;

  }

  update () {
        //While the bubble hasn't been shot it tracks the position of the ship
        if(this.shot===false){
                this.body.x=this.ship.body.x;
                this.body.y=this.ship.body.y;
        //When the bubble is shot it should stay bounded
        }else {

            if(this.body.right >= this.rightBound){
                this.body.velocity.x = -this.body.velocity.x;
            }

            if(this.body.left <= this.leftBound){
                this.body.velocity.x = -this.body.velocity.x;
            }
        }



  }

  shoot() {
      //The shooting angle is limited in so that the bubble can't go down
      if(this.shot === false && this.game.input.activePointer.position.y < this.body.top){
              this.shot = true;
              //Get the current position of mouse and subtract the current position of the ball, you'll have the direction for the shot.
              //Normalization is needed to ensure that the speed is constant.
              var shotVelocity = new Phaser.Point(0,0);
              this.game.input.activePointer.position.copyTo(shotVelocity);
              shotVelocity.subtract(this.body.center.x,this.body.center.y);
              shotVelocity.normalize();
              shotVelocity.setMagnitude(this.maxSpeed);
              this.body.velocity = shotVelocity;
      }
  }

}
