import Phaser from 'phaser';
import Bubble from '../sprites/Bubble';

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, rightBound, leftBound,width,startingBubbleY,bubbleColors}) {
    super(game, x, y, asset);

    this.game = game;
    this.rightBound = rightBound;
    this.leftBound = leftBound;
    this.bubbleRadius=this.game.levelData.bubbleRadius;
    this.game.physics.arcade.enable(this);
    this.bubbleColors = bubbleColors;
    this.grid = [];
    this.gridWidth = width;
    this.scrollSpeedInitial = this.game.levelData.scrollSpeedInitial;
    this.scrollSpeedTarget = this.game.levelData.scrollSpeedTarget;
    this.scrollSpeedTotalTime = this.game.levelData.scrollSpeedTotalTime;
    this.scrollSpeedCurrent = this.game.levelData.scrollSpeedInitial;
    this.gridHeight = Math.ceil(this.game.world.height/this.bubbleRadius)+2 //+2 So that there the bubble feed seems seamless
    this.collisionGroup = new Phaser.Group(this.game);
    this.makegrid(startingBubbleY);
    this.speedText = this.game.add.text(this.rightBound+8,290,+  Math.round(this.getCurrentSpeed()),{fill: '#FFFFFF',fontSize: 30,font:"Small Font Regular"});//"Grid Speed" + '\n'
    //Nearby bubbles on the grid with j,i coordinates
    //Should be used nearbyPositions[offset] where offset is j%2
    this.nearbyPositions = [];
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
    //The the nearby bubbles center point offsets. The y coordinates are reversed when compared to nearbyPositions because game y goes from top to bottom and grid y goes from bottom to top.
    this.nearbyCenterPoints = [new Phaser.Point(-this.bubbleRadius/2,this.bubbleRadius),
    new Phaser.Point(this.bubbleRadius/2,this.bubbleRadius),
    new Phaser.Point(-this.bubbleRadius,0),
    new Phaser.Point(this.bubbleRadius,0),
    new Phaser.Point(-this.bubbleRadius/2,-this.bubbleRadius),
    new Phaser.Point(this.bubbleRadius/2,-this.bubbleRadius)
    ];
    this.newLineCheck = 0;
    this.newLineStaticDistance = this.game.world.height; 
    
  }
  //TODO MAKE THE STUFF THAT DOES NOT DEPEND ON THE GRID
  update () {
      //Create a new row when you see start seeing the top one
      //if(this.grid[this.grid.length-2][0].body.bottom>0){
        if(this.body.y-this.newLineStaticDistance-this.newLineCheck>0){
        //this.findUnconnectedGroups();
        this.newLineCheck += this.bubbleRadius;
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
        this.body.velocity.y =this.getCurrentSpeed();
        this.speedText.setText('Speed' + '\n' + Math.round(this.getCurrentSpeed())+ ' km/s');//"Grid Speed" + '\n'
      }
    }

  makegrid(startingBubbleY){
    //Make the hexagonal grid. Offset the bubbles on every other row. Start with bubbles from row number startingBubbleY.
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
   this.body.velocity.y =this.getCurrentSpeed(); //Sets the speed of the grid object
   this.collisionGroup.setAll('body.velocity.y', this.getCurrentSpeed());
   this.tween = this.game.add.tween(this).to( { scrollSpeedCurrent: this.scrollSpeedTarget }, this.scrollSpeedTotalTime, Phaser.Easing.Linear.None, true);
 }

 getCurrentSpeed(){
     if(this.game.levelData.accelerationToggle){
        return this.scrollSpeedCurrent;    
     }else{
         return this.scrollSpeedInitial;
     }
     //return this.game.levelData.scrollSpeedInitial;
     //return this.scrollSpeedCurrent;
 }

 addBubbleToGrid(i,j,color){
     //Add a bubble to the grid with color(random color if not defined).
    var offset = this.bubbleRadius/2;
    if(j%2 === 1){
        offset+=this.bubbleRadius/2;
    }
    
    if(color != undefined){
        color = color;
    }else{
        var color = this.getRandomColor();
    }
    
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
    var startingI = gridbubble.gridPosition.i;
    var startingJ = gridbubble.gridPosition.j;
    var gridBubbleColor = gridbubble.color;
    var group = this.findGroup(startingI,startingJ,true,gridBubbleColor);
    if(group.length >= 3){
        for(var i = 0; i<group.length;i++){
        //group[i].kill();
        group[i].popIn();
        }
        
        this.findUnconnectedGroups();
    }

    
 }

 onGrid(i,j){
     if(this.getLowestRow()<=j && j<this.grid.length-1){
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
                //if(this.grid[workingJ][workingI]!=null && this.grid[workingJ][workingI].alive && this.grid[workingJ][workingI].checked === false){
                if(this.grid[workingJ][workingI]!=null && this.grid[workingJ][workingI].getStatus()){
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
     for(var j = this.getLowestRow(); j < this.grid.length-1;j++){
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
         //this.grid.length-2 is the current visible top row
         this.findGroup(i,this.grid.length-2,false,null);
     }
     this.killUnchecked();
 }

 killUnchecked(){
    for(var j = this.getLowestRow(); j < this.grid.length-1;j++){
         for(var i = 0;i<this.grid[j].length;i++){
            if(this.grid[j][i]!=null && this.grid[j][i].checked === false){
                //this.grid[j][i].kill();
                this.grid[j][i].popIn();
            }
         }
     }
 }

 snapToGrid(snapBubble,gridBubble){
     //The algorithm looks for a free position on grid that is closest to the position of the bubble that needs to be snapped to the grid.
     //It only looks through the positions that are next to the grid bubble.
     var startI = gridBubble.gridPosition.i;
     var startJ = gridBubble.gridPosition.j;
     var offset = startJ%2;
     
     var snapIndex = 0; // Not used. Probably not needed. DELETE
     var snapPositionJ = startJ + this.nearbyPositions[offset][snapIndex][0];
     var snapPositionI = startI + this.nearbyPositions[offset][snapIndex][1];
     var currentPoint = new Phaser.Point(-100,-100);
     for(var k = 0; k < this.nearbyPositions[offset].length; k++){
        var workingI = startI + this.nearbyPositions[offset][k][1];
        var workingJ = startJ + this.nearbyPositions[offset][k][0];
        var workingPoint = new Phaser.Point(-100,-100);
        if(this.onGrid(workingI,workingJ) && (this.grid[workingJ][workingI]===null || this.grid[workingJ][workingI].alive === false)){
            Phaser.Point.add(gridBubble.body.position,this.nearbyCenterPoints[k],workingPoint);
            if(Phaser.Point.distance(snapBubble.body.position,workingPoint) < Phaser.Point.distance(snapBubble.body.position,currentPoint)){
                snapIndex = k;
                snapPositionJ = workingJ;
                snapPositionI = workingI;
                currentPoint = workingPoint;
            }
        }


     }

     this.addBubbleToGrid(snapPositionI,snapPositionJ,snapBubble.color);
     this.collisionGroup.setAll('body.velocity.y', this.getCurrentSpeed());
     this.body.velocity.y =this.getCurrentSpeed();
     this.speedText.setText('Speed' + '\n' +Math.round(this.getCurrentSpeed())+ ' km/s');//'Speed' + '\n'
     snapBubble.kill();
     return this.grid[snapPositionJ][snapPositionI];
 }

 getLowestRow(){
    if(this.grid.length-this.gridHeight>0){
        return this.grid.length-this.gridHeight-1;
    }else{
        return this.grid.length-this.gridHeight;
    }
    


 }
}
