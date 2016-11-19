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
    this.load.image('yellowbubble', 'assets/images/yellowBubble.png');
    this.load.image('greenbubble', 'assets/images/greenBubble.png');
    this.load.image('purplebubble', 'assets/images/purpleBubble.png');
    this.load.image('bubbleorder', 'assets/images/bubbleOrderElement.png');
    this.load.image('ship', 'assets/images/bubble_spaceship.png');
    this.load.image('background', 'assets/images/bubble_tausta2.png');
    this.load.image('minus', 'assets/images/minus.png');
    this.load.image('plus', 'assets/images/plus.png');
    this.load.image('play', 'assets/images/playbutton.png');
    this.load.image('side', 'assets/images/side.png');
  }

  create () {
    this.state.start('StartMenu');
  }

}
