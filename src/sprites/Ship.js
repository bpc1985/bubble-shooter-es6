import Phaser from 'phaser';
import Bubble from '../sprites/Bubble';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, rightBound, leftBound,bubbleColors}) {
    super(game, x, y, asset);

    this.game = game;
    this.anchor.setTo(0.5,0.5);
    this.game.physics.arcade.enable(this);
    // Maybe something more intelligent needed with these values,
    // for example when we have a grid object we can give it or something.
    this.rightBound = rightBound;
    this.leftBound = leftBound;
    this.maxSpeed = 300;
    this.bubbleShootingSpeed = 500;
    //Available bubble colors
    this.bubbleColors = bubbleColors;
    //Shooting order and ready to shoot
    this.bubbleOrder = ['blue','red'];
    this.readyToShoot = true;

    this.bubbleImage = new Bubble({
        game: this.game,
        x :this.body.center.x-32,
        y: this.body.center.y-this.height*1.2,
        asset: this.getBubbleAsset(0),
        rightBound: this.rightBound,
        leftBound: this.leftBound,
        ship:this,
        color:this.getBubbleColor(0),
        gridPosition:{i:0,j:0}
      });
    this.game.add.existing(this.bubbleImage);

  }

  update () {

  }

  move(direction) {


    if(direction === 'left'){
      if(this.body.left>this.leftBound){
        this.body.velocity.x = -this.maxSpeed;
      }else{
        this.body.velocity.x = 0;
        this.body.x = this.leftBound;
      }
    } else if(direction === 'right') {
      if(this.body.right < this.rightBound) {
        this.body.velocity.x = this.maxSpeed;
      } else{
        this.body.velocity.x = 0;
        this.body.x=this.rightBound - this.body.width ;
      }
    }
    else {
      this.body.velocity.x = 0;
    }
    this.bubbleImage.body.velocity=this.body.velocity;

  }

  shoot(){
    if(this.readyToShoot && this.game.input.activePointer.position.y < this.bubbleImage.body.top){
      this.readyToShoot = false;
      //Get the current position of mouse and subtract the current position of the ball, you'll have the direction for the shot.
      //Normalization is needed to ensure that the speed is constant.
      var shotVelocity = new Phaser.Point(0, 0);
      this.game.input.activePointer.position.copyTo(shotVelocity);
      shotVelocity.subtract(this.bubbleImage.body.center.x,this.bubbleImage.body.center.y);
      shotVelocity.normalize();
      shotVelocity.setMagnitude(this.bubbleShootingSpeed);
      this.bubble = new Bubble({
        game: this.game,
        //x :this.body.center.x,
        //y: this.body.center.y,
        x:this.bubbleImage.body.center.x,
        y:this.bubbleImage.body.center.y,
        asset: this.getBubbleAsset(0),
        rightBound: this.rightBound,
        leftBound: this.leftBound,
        ship:this,
        color:this.getBubbleColor(0),
        gridPosition:{i:0,j:0}
      });
      this.bubble.body.velocity = shotVelocity;
      this.bubbleImage.loadTexture(this.getBubbleAsset(1));
    }
  }

  readyGun(){
      this.readyToShoot = true;
      this.bubbleOrder[0] = this.bubbleOrder[1];
      this.bubbleOrder[1] = this.bubbleColors[Math.floor((Math.random() * this.bubbleColors.length))];
      
  }

  getBubbleAsset(i){
    return this.bubbleOrder[i] + 'bubble';
  }
  getBubbleColor(i){
    return this.bubbleOrder[i];
  }

}
