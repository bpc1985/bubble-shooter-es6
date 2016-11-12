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
    this.minusButton = new Phaser.Button(this.game,this.x+this.width+this.margin,y,'minus', this.decreaseVariable, this);
    this.game.add.existing(this.minusButton); 
    
    this.textElement = this.game.add.text(this.minusButton.x + this.minusButton.width+ this.margin,y,text + variable,{fill: '#000000',fontSize: 20});

    this.plusButton = new Phaser.Button(this.game,this.textElement.x+this.textElement.width+this.margin,y,'plus', this.increaseVariable, this);
    this.game.add.existing(this.plusButton);

}


  update () {
    
}
    decreaseVariable(){
        if(this.variable > this.lowerBound){
            this.variable-= this.scalar;
        }
        this.textElement.setText(this.text + this.variable);
    }
    increaseVariable(){
        if(this.variable < this.upperBound){
            this.variable+= this.scalar;
        }
        this.textElement.setText(this.text + this.variable);
    }

    


}
