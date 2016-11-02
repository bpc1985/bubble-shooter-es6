import Phaser from 'phaser';
import Bubble from '../sprites/Bubble';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, ship}) {
    super(game, x, y, asset);

    this.game = game;
    this.ship = ship;
    this.bubbleRadius = 32;
    this.margin = 4;
    this.bubbleOrderUI = [];
    this.text = new Phaser.Text(this.game,x,y,"Next");

    for (var i = 0; i < this.ship.bubbleOrder.length; i++) {
      this.bubbleOrderUI[i] = new Bubble({
        game: this.game,
        x : x+this.margin+this.bubbleRadius/2,
        y: y+ this.bubbleRadius*1.2*i+ this.bubbleRadius/2+ this.margin,
        asset: this.ship.getBubbleAsset(i),
        rightBound: this.rightBound,
        leftBound: this.leftBound-1,
        ship:this});
        this.game.add.existing(this.bubbleOrderUI[i]);
    }

  }

  updateOrder(){
    for (var i = 0; i < this.ship.bubbleOrder.length; i++){
      this.bubbleOrderUI[i].loadTexture(this.ship.getBubbleAsset(i));
    }
  }
  update () {
    }


}