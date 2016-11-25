import Phaser from 'phaser';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset,text,variable,scalar,lowerBound,upperBound}) {
      super(game, x, y, asset);
    this.game = game;
    this.margin = 16;
    this.variable = variable;
    this.scalar = scalar;
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.visible =false;
    this.text = text; 
    
    this.textElement = this.game.add.text(this.x+this.width+this.margin,y,text + variable,{fill: '#000000',fontSize: 20});

    this.toggleButton = new Phaser.Button(this.game,this.textElement.x+this.textElement.width+this.margin,y,'plus', this.toggleVariable, this);
    this.game.add.existing(this.toggleButton);

}


  update () {
    
}

    toggleVariable(){
        if(this.variable === false){
            this.variable = true;
        }else{
            this.variable = false;
        }
        this.textElement.setText(this.text + this.variable);
    }

    


}
