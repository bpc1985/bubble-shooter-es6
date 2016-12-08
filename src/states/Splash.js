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
    this.load.image('bluebubble', 'assets/images/bluebubble.png');
    this.load.image('redbubble', 'assets/images/redbubble.png');
    this.load.image('yellowbubble', 'assets/images/yellowbubble.png');
    this.load.image('greenbubble', 'assets/images/greenbubble.png');
    this.load.image('purplebubble', 'assets/images/purplebubble.png');
    this.load.image('bubbleorder', 'assets/images/bubbleOrderElement.png');
    this.load.image('ship', 'assets/images/bubble_spaceship.png');
    this.load.image('redship', 'assets/images/bubble_spaceship.png');
    this.load.image('blueship', 'assets/images/bubble_spaceship_blue.png');
    this.load.image('greenship', 'assets/images/bubble_spaceship_green.png');
    this.load.image('purpleship', 'assets/images/bubble_spaceship_purple.png');
    this.load.image('yellowship', 'assets/images/bubble_spaceship_yellow.png');
    this.load.image('background', 'assets/images/bubble_bg.jpeg');
    this.load.image('score', 'assets/images/distance_speed.jpeg');
    this.load.image('minus', 'assets/images/minusVolume.png');
    this.load.image('plus', 'assets/images/plusVolume.png');
    this.load.image('play', 'assets/images/playbutton.png');
    this.load.image('side', 'assets/images/side.png');
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('controls', 'assets/images/controls.png');
    this.load.image('mission', 'assets/images/mission.png');
    this.load.image('gameover', 'assets/images/GAMEOVER.png');

    this.load.audio('wallhit','assets/Bubble_Sounds/Special.wav');
    this.load.audio('bubblehit','assets/Bubble_Sounds/Hit_bubble2.wav');
    this.load.audio('bg1','assets/Bubble_Sounds/zyklus_improv.mp3');
    this.load.audio('shipexplosion','assets/Bubble_Sounds/Explosion.wav');

  }

  create () {
    this.state.start('Menu');
  }

}
