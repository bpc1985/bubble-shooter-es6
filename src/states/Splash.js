import Phaser from 'phaser';
import { centerGameObjects } from '../utils';

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);
    //
    // load your assets
    //
    this.load.image('bluebubble', 'assets/images/blueBubble.png');
    this.load.image('redbubble', 'assets/images/redBubble.png');
    this.load.image('bubbleorder', 'assets/images/bubbleOrderElement.png');
    
  }

  create () {
    this.state.start('Game');
  }

}
