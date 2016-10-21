import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, rightBound, leftBound}) {
    super(game, x, y, asset);

    this.game = game;
    this.anchor.setTo(0.5,0.5);
    this.game.physics.arcade.enable(this);
    //Maybe something more intelligent needed with these values, for example when we have a grid object we can give it or something.
    this.rightBound = rightBound;
    this.leftBound = leftBound;

    this.maxSpeed = 500;
    
  }

  update () {
  }

  move(direction){
      if(direction === 'left'){
          if(this.body.left>this.leftBound){
              this.body.velocity.x = -this.maxSpeed;
          }else{
              this.body.velocity.x = 0;
              this.body.x=this.leftBound;
          }
          
      }else if(direction === 'right'){
          if(this.body.right<this.rightBound){
              this.body.velocity.x = this.maxSpeed;
          }else{
              this.body.velocity.x = 0;
              this.body.x=this.rightBound - this.body.width ;
          }
      }
      else{
          this.body.velocity.x = 0;
      }

  }

}
