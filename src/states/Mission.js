import Phaser from 'phaser';
import ButtonElement from '../sprites/ButtonElement';
import ToggleElement from '../sprites/ToggleElement';
export default class extends Phaser.State {
  init () {}

  preload () {
    
  }

  create () {
      this.game.stage.backgroundColor = "#000000"
      this.logoWidth = 640;
      this.logo = this.game.add.image(0,0,'mission');
      this.menuButton = new Phaser.Button(this.game,0,this.game.world.height,'play', this.showMenu, this);
      this.menuButton.y -= this.menuButton.height;
      this.game.add.existing(this.menuButton);
  }

  showMenu(){
      this.state.start('Menu');
  }
}
