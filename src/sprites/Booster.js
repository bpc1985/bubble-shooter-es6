import Phaser from 'phaser';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, rightBound, leftBound}) {
    super(game, x, y, asset);

    this.game = game;
    this.anchor.setTo(0.5,0.5);
    this.shot = false;
    this.game.physics.arcade.enable(this);
    this.bubbleRadius = this.game.levelData.bubbleRadius;
    this.margin = 0;
    this.body.setCircle(this.bubbleRadius/2-this.margin);
    this.rightBound = rightBound;
    this.leftBound = leftBound;
    this.body.velocity.y = this.game.levelData.boosterSpeed;
    this.killCheck = false;

  }

  update () {
    if(this.body.top > this.game.world.height){
      this.kill();
    }

}
  popIn(){
    this.killCheck = true;
    if(this.game.levelData.disableTween){
      this.kill();
    }else{
      this.tween = this.game.add.tween(this.scale).to( { x: 0, y: 0 }, 70, Phaser.Easing.Linear.None, true);
      this.tween.onComplete.add(this.kill,this);
    }
    
    
  }


}
