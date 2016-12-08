import Phaser from 'phaser';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset,text,variable,scalar,lowerBound,upperBound,leftMargin,rightMargin}) {
      super(game, x, y, asset);
    this.game = game;
    this.margin = rightMargin ? rightMargin : 32;
    this.leftmargin = leftMargin ? leftMargin : 8;
    this.variable = variable;
    this.scalar = scalar;
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.visible =false;
    this.text = text;
    this.minusButton = new Phaser.Button(this.game,this.x+this.width+this.margin,y,'minus', this.decreaseVariable, this);
    this.minusButton.scale.setTo(0.5,0.5);
    this.game.add.existing(this.minusButton); 
    
    this.textElement = this.game.add.text(this.minusButton.x + this.minusButton.width+this.leftmargin,y+10,text + variable,{fill: '#FFFFFF',fontSize: 20,font:"Small Font Regular"});

    this.plusButton = new Phaser.Button(this.game,this.textElement.x+this.textElement.width+this.margin,y,'plus', this.increaseVariable, this);
    this.plusButton.scale.setTo(0.5,0.5);
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

    getTotalWidth(){
        console.log(this.width+this.margin+this.minusButton.width+this.leftmargin+this.textElement.width+this.margin+this.plusButton.width);
        return this.width+this.margin+this.minusButton.width+this.leftmargin+this.textElement.width+this.margin+this.plusButton.width;
    }


}
