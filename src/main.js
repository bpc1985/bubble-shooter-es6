import 'pixi';
import 'p2';
import Phaser from 'phaser';

import BootState from './states/Boot';
import SplashState from './states/Splash';
import GameState from './states/Game';
import StartMenu from './states/StartMenu';
import Menu from './states/Menu';
import Controls from './states/Controls';
import Mission from './states/Mission';
import End from './states/End';

class Game extends Phaser.Game {

  constructor () {
    //let width = document.documentElement.clientWidth > 768 ? 768 : document.documentElement.clientWidth;
    //let height = document.documentElement.clientHeight > 1024 ? 1024 : document.documentElement.clientHeight;
    
    let height = 640;
    let width = 800;
    super(width, height, Phaser.AUTO, 'content', null);
      
    
      this.levelData = {
        bubbleRadius: 32, //Bubble radius actually means bubble diameter but it is referenced everywhere as the radius.
        width: 15,
        shootSpeed: 700,
        shipSpeed: 300,
        scrollSpeedInitial: 20,
        scrollSpeedTarget: 30,
        scrollSpeedTotalTime: 100000,
        scrollSpeedAcceleration: 0,
        accelerationToggle: true,//False = boosters , true = gradual acceleration
        bubbleColors: ['blue', 'red','green'],
        allBubbleColors: ['blue', 'red','green','yellow','purple'],
        bubbleStartingHeight: 12, //The higher the number the higher the bubbles will start.Measured in tiles rather than raw pixels. MAX: Floor(this.game.world.height/bubbleRadius)
        disableTween: false,
        score: 0,
        boosterSpeed: 200,
        boosterAccelerationModifier: 2,
        boosterTime:1,
        volume:0.05,
        musicVolume:1

      };
    
    
    this.state.add('Boot', BootState, false);
    this.state.add('Splash', SplashState, false);
    this.state.add('Game', GameState, false);
    this.state.add('StartMenu', StartMenu, false);
    this.state.add('Menu', Menu, false);
    this.state.add('Controls', Controls, false);
    this.state.add('Mission', Mission, false);
    this.state.add('End', End, false);
    this.state.start('Boot');
  }
}

window.game = new Game();
