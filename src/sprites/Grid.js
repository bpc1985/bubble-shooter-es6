import Phaser from 'phaser';
import Bubble from '../sprites/Bubble';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, rightBound, leftBound,width,startingBubbleY,bubbleColors}) {
    super(game, x, y, asset);

    this.game = game;
    this.rightBound = rightBound;
    this.leftBound = leftBound;
    this.bubbleRadius=32;
    this.game.physics.arcade.enable(this);
    this.bubbleColors = bubbleColors;
    this.grid = [];
    this.gridWidth = width;
    this.gridHeight = Math.ceil(this.game.world.height/this.bubbleRadius)+1
    this.collisionGroup = new Phaser.Group(this.game);
    this.makegrid(startingBubbleY);
    this.nearbyPositions = [];
    //j,i
    this.nearbyPositions[0] = [[-1,-1],
        [-1,0],
        [0,-1],
        [0,1],
        [1,-1],
        [1,0]];
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
        if(length%2 === 1){
            row_length-=1;

        }

        this.grid[length] = [];
        for(var i = 0; i<row_length;i++){
            this.addBubbleToGrid(i,length);

        }
        this.collisionGroup.setAll('body.velocity.y', this.getCurrentSpeed());
      }
    }

  makegrid(startingBubbleY){
    

    for(var j = 0; j<this.gridHeight;j++){
        this.grid[j] = [];
        var row_length = this.gridWidth;
        if(j%2 === 1){
            row_length-=1;
        }
        for(var i = 0; i<row_length; i++){
            if(j>startingBubbleY){
                this.addBubbleToGrid(i,j);
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
    if(j%2 === 1){
        offset+=this.bubbleRadius/2;
    }
    var color = this.getRandomColor();

    this.grid[j][i] = new Bubble({
        game:this.game,
        x:this.leftBound+offset+i*this.bubbleRadius,
        y:this.body.y-this.bubbleRadius*j-this.bubbleRadius/2,
        asset:this.getBubbleAsset(color),
        rightBound:this.rightBound,
        leftBound:this.leftBound,
        color:color,
        gridPosition: {i:i,j:j}
    });
    this.game.add.existing(this.grid[j][i]);
    this.collisionGroup.add(this.grid[j][i]);
 }

 getRandomColor(){
     return this.bubbleColors[Math.floor((Math.random() * this.bubbleColors.length))];

 }
 getBubbleAsset(color){
     return color + 'bubble';
 }
 onHit(gridbubble){
     //var startingI = gridbubble.gridPosition.i;
     //var startingJ = gridbubble.gridPosition.j;
     //var gridBubbleColor = gridbubble.color;
     ////this.grid[startingJ][startingI].kill();
     //gridbubble.kill();
     //var offset = startingJ % 2;
     //for(var i = 0; i < this.nearbyPositions[offset].length; i++){
     //    var workingI = startingI + this.nearbyPositions[offset][i][1];
     //    var workingJ = startingJ + this.nearbyPositions[offset][i][0];
     //    if(this.onGrid(workingI,workingJ)){
     //        //
     //       if(this.grid[workingJ][workingI]!=null && this.grid[workingJ][workingI]!= undefined && this.grid[workingJ][workingI].alive){
     //           this.recursiveDestruction(workingI,workingJ,gridBubbleColor);
     //       }
     //       
     //    }
     //    
     //}
     //
    var startingI = gridbubble.gridPosition.i;
    var startingJ = gridbubble.gridPosition.j;
    var gridBubbleColor = gridbubble.color;
    var group = this.findGroup(startingI,startingJ,true,gridBubbleColor);
    for(var i = 0; i<group.length;i++){
        group[i].kill();
    }
    this.findUnconnectedGroups();
 }
 recursiveDestruction(i,j,color){
     if(color === this.grid[j][i].color){
         this.grid[j][i].kill();
         var offset = j % 2;
         for(var k = 0; k < this.nearbyPositions[offset].length; k++){
            var workingI = i + this.nearbyPositions[offset][k][1];
            var workingJ = j + this.nearbyPositions[offset][k][0];
            if(this.onGrid(workingI,workingJ)){
                if(this.grid[workingJ][workingI]!=null && this.grid[workingJ][workingI]!= undefined && this.grid[workingJ][workingI].alive){
                    this.recursiveDestruction(workingI,workingJ,color);
                }
                
            }
         
     }
     }else{
         //Do nothing
     }
 }

 onGrid(i,j){
     if(this.grid.length-this.gridHeight<=j && j<this.grid.length-1){
         if(0 <= i && i<this.grid[j].length){
             return true;
         }
     }
     return false;
 }

 findGroup(startI,startJ,reset,color){
     if(this.onGrid(startI,startJ)){
        if(reset === true){
            this.resetChecked();
        }
        var offset = startJ%2;
        var group = [this.grid[startJ][startI]];
        this.grid[startJ][startI].checked =true;
        for(var k = 0; k < this.nearbyPositions[offset].length; k++){
            var workingI = startI + this.nearbyPositions[offset][k][1];
            var workingJ = startJ + this.nearbyPositions[offset][k][0];
            //console.log(workingJ + "," +workingI);
            if(this.onGrid(workingI,workingJ)){
                if(this.grid[workingJ][workingI]!=null && this.grid[workingJ][workingI].alive && this.grid[workingJ][workingI].checked === false){
                    if(color ===null){
                        group = group.concat(this.findGroup(workingI,workingJ,false,null));
                    }else if(this.grid[workingJ][workingI].color === color){
                        group = group.concat(this.findGroup(workingI,workingJ,false,color));
                    }
                }
                
            }
        }
        return group;

     }else{
         return [];
     }
     
     
 }
 resetChecked(){
     for(var j = this.grid.length-this.gridHeight; j < this.grid.length-1;j++){
         for(var i = 0;i<this.grid[j].length;i++){
            if(this.grid[j][i]!=null){
                this.grid[j][i].checked = false;
            }
         }
     }
 }

 findUnconnectedGroups(){
     this.resetChecked();
     for(var i = 0; i<this.grid[this.grid.length-2].length;i++){
         //console.log(workingJ + "," +workingI);
         this.findGroup(i,this.grid.length-2,false,null);
     }
     this.killUnchecked();
 }

 killUnchecked(){
    for(var j = this.grid.length-this.gridHeight; j < this.grid.length-1;j++){
         for(var i = 0;i<this.grid[j].length;i++){
            if(this.grid[j][i]!=null && this.grid[j][i].checked === false){
                this.grid[j][i].kill();
            }
         }
     }
 }
}
