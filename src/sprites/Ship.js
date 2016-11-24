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
    this.maxSpeed = this.game.levelData.shipSpeed;
    this.bubbleShootingSpeed = this.game.levelData.shootSpeed;
    this.bubbleRadius = this.game.levelData.bubbleRadius;
    //Available bubble colors
    this.bubbleColors = bubbleColors;
    //Shooting order and ready to shoot
    this.bubbleOrder = [this.getRandomColor(),this.getRandomColor()];
    this.readyToShoot = true;

    this.bubbleImage = new Bubble({
        game: this.game,
        //x :this.body.center.x-this.bubbleRadius,
        //y: this.body.center.y-this.height*1.2,
        x:0,
        y:-2.5*this.height/4,
        asset: this.getBubbleAsset(0),
        rightBound: this.rightBound,
        leftBound: this.leftBound,
        ship:this,
        color:this.getBubbleColor(0),
        gridPosition:{i:0,j:0}
      });
    //this.game.add.existing(this.bubbleImage);
    this.bubbleImage.scale.setTo(0.5,0.5);
    this.addChild(this.bubbleImage);
    //this.bubbleImage.visible = false;
    this.updateShipColor();
    //this.scale.setTo(0.1,0.1);
    this.tween = this.game.add.tween(this.body.position).to( { x: this.body.x, y: this.game.world.height - this.height }, 300, Phaser.Easing.Sinusoidal.In, true);//{ x: 1, y: 1 }
    
  }

  update () {

  }

  move(direction) {
    //Pls fix all of this bad code

    if(direction === 'left'){
      if(this.body.left>this.leftBound){
        this.body.velocity.x = -this.maxSpeed;
      }else{
        this.body.velocity.x = 0;
        this.body.x = this.leftBound;
        //this.bubbleImage.body.x = this.leftBound + this.body.width/2 - this.bubbleRadius/2;
      }
    } else if(direction === 'right') {
      if(this.body.right < this.rightBound) {
        this.body.velocity.x = this.maxSpeed;
      } else{
        this.body.velocity.x = 0;
        this.body.x=this.rightBound - this.body.width ;
        //this.bubbleImage.body.x = this.rightBound - this.body.width/2- this.bubbleRadius/2;
      }
    }
    else {
      this.body.velocity.x = 0;
    }
    //this.bubbleImage.body.velocity.x = this.body.velocity.x;

  }

  shoot(){
    if(this.readyToShoot && this.game.input.activePointer.position.y < this.bubbleImage.body.top){//this.bubbleImage.body.top
      this.readyToShoot = false;
      var shotX = this.bubbleImage.body.center.x;//this.bubbleImage.body.center.x
      var shotY = this.bubbleImage.body.center.y;//this.bubbleImage.body.center.y
      //Get the current position of mouse and subtract the current position of the ball, you'll have the direction for the shot.
      //Normalization is needed to ensure that the speed is constant.
      var shotVelocity = new Phaser.Point(0, 0);
      this.game.input.activePointer.position.copyTo(shotVelocity);
      shotVelocity.subtract(shotX,shotY);
      shotVelocity.normalize();
      shotVelocity.setMagnitude(this.bubbleShootingSpeed);
      this.bubble = new Bubble({
        game: this.game,
        //x :this.body.center.x,
        //y: this.body.center.y,
        //x:this.bubbleImage.body.x+this.bubbleRadius/2,
        //y:this.bubbleImage.body.y+this.bubbleRadius/2,
        x:shotX,
        y:shotY,
        asset: this.getBubbleAsset(0),
        rightBound: this.rightBound,
        leftBound: this.leftBound,
        ship:this,
        color:this.getBubbleColor(0),
        gridPosition:{i:-1,j:-1}
      });
      this.bubble.body.velocity = shotVelocity;

      //this.bubble.scale.setTo(0.5,0.5);
      
      this.game.add.existing(this.bubble);
      this.bubble.margin = 4;
      this.bubble.body.setCircle(16-this.bubble.margin);
      this.bubble.scale.setTo(0.1,0.1);
      this.tween = this.game.add.tween(this.bubble.scale).to( { x: 1, y: 1 }, 50, Phaser.Easing.Linear.None, true);

      this.loadGun();
      return true;
    }
    return false;
  }

  readyGun(){
      if(this.readyToShoot === false){
        this.readyToShoot = true;
      }


  }
  loadGun(){
    for(var i = 0;i<this.bubbleOrder.length-1;i++){
      this.bubbleOrder[i] = this.bubbleOrder[i+1];
    }
    this.bubbleOrder[this.bubbleOrder.length-1] = this.getRandomColor();
    this.bubbleImage.loadTexture(this.getBubbleAsset(0));
    this.updateShipColor();
  }

  getBubbleAsset(i){
    return this.bubbleOrder[i] + 'bubble';
  }
  getBubbleColor(i){
    return this.bubbleOrder[i];
  }
  getRandomColor(){
    return this.bubbleColors[Math.floor((Math.random() * this.bubbleColors.length))];
  }
  getShipAsset(i){
    return this.bubbleOrder[i] + 'ship';
  }
  updateShipColor(){
    this.loadTexture(this.getShipAsset(1));
  }


}
