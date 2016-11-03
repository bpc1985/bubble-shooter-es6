import Phaser from 'phaser';
import Bubble from '../sprites/Bubble';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, rightBound, leftBound,width,startingBubbleY}) {
    super(game, x, y, asset);

    this.game = game;
    this.rightBound = rightBound;
    this.leftBound = leftBound;
    this.bubbleRadius=32;
    this.game.physics.arcade.enable(this);
    this.grid = [];
    this.height = this.game.world.height;
    this.gridWidth = width;
    this.collisionGroup = new Phaser.Group(this.game);
    this.makegrid(startingBubbleY);
    this.nearbyPositions = [];
    this.nearbyPositions[0] = [[-1,1],
        [-1,0],
        [0,-1],
        [0,1],
        [1,0],
        [1,1]];
    this.nearbyPositions[1] = [[-1,0],
        [-1,1],
        [0,-1],
        [0,1],
        [1,0],
        [1,1]];
    

    
  }

  update () {
      //Create a new row when you see start seeing the new one
      if(this.grid[this.grid.length-1][0].body.bottom>0){
        var length = this.grid.length;
        var row_length = this.gridWidth;
        var offset = this.bubbleRadius/2;
        if(length%2 === 1){
            row_length-=1;
            offset+=this.bubbleRadius/2;
        }

        this.grid[length] = [];
        for(var i = 0; i<row_length;i++){
                this.grid[length][i] = new Bubble({
                game:this.game,
                x:this.leftBound+offset+i*this.bubbleRadius,
                y:this.body.y-this.bubbleRadius*length-this.bubbleRadius/2,
                asset:'bluebubble',
                rightBound:this.rightBound,
                leftBound:this.leftBound
            });
            this.game.add.existing(this.grid[length][i]);
            this.collisionGroup.add(this.grid[length][i]);
        }
        this.collisionGroup.setAll('body.velocity.y', this.getCurrentSpeed());
      }
    }

  makegrid(startingBubbleY){
    

    for(var j = 0; j<Math.ceil(this.height/this.bubbleRadius)+1;j++){
        this.grid[j] = [];
        var row_length = this.gridWidth;
        var offset = this.bubbleRadius/2;
        if(j%2 === 1){
            row_length-=1;
            offset+=this.bubbleRadius/2;
        }
        for(var i = 0; i<row_length; i++){
            if(j>startingBubbleY){
                this.grid[j][i] = new Bubble({
                game:this.game,
                x:this.leftBound+offset+i*this.bubbleRadius,
                y:this.body.y-this.bubbleRadius*j-this.bubbleRadius/2,
                asset:'bluebubble',
                rightBound:this.rightBound,
                leftBound:this.leftBound
            });
            this.game.add.existing(this.grid[j][i]);
            this.collisionGroup.add(this.grid[j][i]);
            }else{
                this.grid[j][i] = null;
            }
            
        }
   }
   this.body.velocity.y =this.getCurrentSpeed();
   this.collisionGroup.setAll('body.velocity.y', this.getCurrentSpeed());
 }

 getCurrentSpeed(){
     return 0;
 }

 addBubbleToGrid(i,j){
    var offset = this.bubbleRadius/2;
    if(length%2 === 1){
        row_length-=1;
        offset+=this.bubbleRadius/2;
    }
    this.grid[j][i] = new Bubble({
        game:this.game,
        x:this.leftBound+offset+i*this.bubbleRadius,
        y:this.body.y-this.bubbleRadius*length-this.bubbleRadius/2,
        asset:'bluebubble',
        rightBound:this.rightBound,
        leftBound:this.leftBound
    });
    this.game.add.existing(this.grid[length][i]);
    this.collisionGroup.add(this.grid[length][i]);
 }


}
