////////////////Setting up the canvas
/////////////////////////////////////
c1 = document.getElementById("Height");
ctx1 = c1.getContext('2d');

c = document.getElementById('A*');
ctx = c.getContext('2d');

c2 = document.getElementById('Info');
ctx2 = c2.getContext('2d');

ctx.width = c.width;
ctx.height = c.height;
/////////////////////////////////////

var img = new Image();
img.src = "astarJS/heightmap.png"

var img2 = new Image();
img2.src = "astarJS/heightmap1.png"

var img3 = new Image();
img3.src = "astarJS/heightmap2.png"

var img4 = new Image();
img4.src = "astarJS/heightmap3.png"

var img5 = new Image();
img5.src = "astarJS/heightmap4.png"

var img6 = new Image();
img6.src = "astarJS/heightmap5.png"

var img7 = new Image();
img7.src = "astarJS/heightmap6.png"

var img8 = new Image();
img8.src = "astarJS/heightmap7.png"

var noPathImg = new Image();
noPathImg.src = "astarJS/backdrop.png"

var Images = [];
Images.push(img);
Images.push(img2);
Images.push(img3);
Images.push(img4);
Images.push(img5);
Images.push(img6);
Images.push(img7);
Images.push(img8);

var currentHeuristic = 2;

var col = 40;
var row = 40;
var grid = new Array(col);

var w = ctx.width / row;
var h = ctx.height / col;

var heightMapData = [];

var notFinal = false;
var counter = 0;
var end = [col-1][col-1];
var maxHeight = 0;
var openSet = [];
var closedSet = [];
var astarPath = [];
var Ending = false;
var DiagCost = 2;
var StraightCost = 1;
var cellHeight = 0;

var drawSearch = false;
var isMapRandom = true;
var drawCircles = false;
var allowNeighbours = false;
var currentHeightMap;

var cellHeightArray = [];

window.onload = function()
{	
    init();
    Setup();
	Draw();
}

//Function to constantly get the mouse's position (used for collision with buttons and images)
function init()
{
    c1.addEventListener("mousedown", getPosition, false);
}

function createHeight(heightImage)
{
	ctx1.drawImage(heightImage,0,0);
    var imgData = ctx1.getImageData(0, 0, 40, 40);
	ctx1.clearRect(0,0,40,40);
	
	for(var i = 0; i < imgData.data.length; i++)
	{
		heightMapData.push(imgData.data[i]);
	}
}

function MakeMap()
{
	for(var x = 0; x < heightMapData.length; x += 4)
	{
		if(heightMapData[x] < 40 && heightMapData[x+1] < 40 && heightMapData[x+2] < 40)
		{
			cellHeight = 3;
		}
		else if(heightMapData[x] > 40 && heightMapData[x] < 75
		&&      heightMapData[x+1] > 40 && heightMapData[x+1] < 75
		&&      heightMapData[x+2] > 40 && heightMapData[x+2] < 75)
		{
			cellHeight = 2;
		}
		else if(heightMapData[x] > 75 && heightMapData[x] < 115
		&&      heightMapData[x+1] > 75 && heightMapData[x+1] < 115
		&&      heightMapData[x+2] > 75 && heightMapData[x+2] < 115)
		{
			cellHeight = 1;
		}else
		{
			cellHeight = 0;
		}
		cellHeightArray.push(cellHeight);
	}
}

function SetupHeightMap()
{
	//Implementing the 2D array by making every column have a set ammout of rows
	for(var x = 0; x < col; x++)
	{
		grid[x] = new Array(row);
	}
	
	//Populating the array with Cells
	for(var x = 0; x < col; x++)
	{
		for(var y = 0; y < row; y++)
		{
			grid[x][y] = new HeightCell(x,y, cellHeightArray[x + y * 40]);
		}
	}
	
	//Adding every neighbour for every cell
	for(var x = 0; x < col; x++)
	{
		for(var y = 0; y < row; y++)
		{
			grid[x][y].addNeighbours(grid);
		}
	}
	
	//Asigning the start and end point
	start = grid[0][0];
	end = grid[col-1][row-1];

	//Making the start and finish not a wall by default
	start.wallHeight = 0;
	addEventListener.wallHeight = 0;


	//Start the search from the start
	openSet.push(start);
}

function HeightCell(x,y, height)
{
	//Position on the grid
	this.x = x;
	this.y = y;
	
	//Variables needed for calculations
	this.f = 0;
	this.g = 0;
	this.h = 0;
	
	this.wallHeight = height;	
	
	this.drawCell = function(color)
	{
		if(drawCircles)
		{
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(this.x * w+12, this.y * h+12,11,0,2*Math.PI);
		ctx.stroke();
		ctx.stroke();
		ctx.fill();
		}		
		else{
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.rect(this.x * w+1, this.y * h+1, w-2, h-2);
		ctx.stroke();
		ctx.stroke();
		ctx.fill();
		}
		
		ctx.fillStyle = "red";
		ctx.font = "12px Arial";
		if(this.wallHeight != 0){
			ctx.fillText(this.wallHeight, this.x * w+8.5, this.y * h+16);
		}
	}
	this.cameFrom = undefined;
	this.neighbours = [];
	this.addNeighbours = function(grid)
	{
		//Right
		if(x < col-1)
		{
			this.neighbours.push(grid[x+1][y]);
		}
		
		//Left
		if(x > 0)
		{
			this.neighbours.push(grid[x-1][y]);
		}
		
		//Down
		if(y < row-1)
		{
			this.neighbours.push(grid[x][y+1]);
		}
		
		//Up
		if(y > 0)
		{
			this.neighbours.push(grid[x][y-1]);
		}
	
		if(allowNeighbours)
		{
			//Top Left
			if(x > 0 && y > 0)
			{
				this.neighbours.push(grid[x-1][y-1]);
			}
			
			//Top Right
			if(x > 0 && y < row-1)
			{
				this.neighbours.push(grid[x-1][y+1]);
			}
			
			//Bottom Left
			if(x > col-1 && y > 0)
			{
				this.neighbours.push(grid[x+1][y-1]);
			}
			
			//Bottom Right
			if(x < col-1 && y < row-1)
			{
				this.neighbours.push(grid[x+1][y+1]);
			}			
		}
	}
}

//Removing an item from an array.
//Simple algorithm, can be massively improved.
function removeArrayObject(inArray, cutElement)
{
	for(var x = inArray.length-1; x >= 0; x--)
	{
		if(inArray[x] == cutElement)
		{
			inArray.splice(x, 1);
		}
	}
}

function HeuristicOne(A, B) //Euclidian Distance
{
	return Math.sqrt(Math.pow(A.x-B.x,2) + Math.pow(A.y-B.y,2))
}

function HeuristicTwo(A, B) //Manhattan Distance
{
	return Math.abs(A.x - B.x) + Math.abs(A.y - B.y);
}

function HeuristicThree(A, B)
{	
	//Heuristic that takes different values for cost (better for diagonals)
	dx = Math.abs(A.x - B.x)
	dy = Math.abs(A.y - B.y)
	return StraightCost * (dx + dy) + (DiagCost - 2 * StraightCost) * Math.min(dx, dy)
}

function Cell(x,y)
{
	//Position on the grid
	this.x = x;
	this.y = y;
	
	//Variables needed for calculations
	this.f = 0;
	this.g = 0;
	this.h = 0;
	
	var heightTemp = Math.random();
	this.wallHeight = 0;
	
	if(heightTemp < 0.7){this.wallHeight = 0;}
	if(heightTemp > 0.7 && heightTemp < 0.8){this.wallHeight = 1;}
	if(heightTemp > 0.8 && heightTemp < 0.9){this.wallHeight = 2;}
	if(heightTemp > 0.9 && heightTemp < 1){this.wallHeight = 3;}	
	
	this.drawCell = function(color)
	{
		if(drawCircles)
		{
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(this.x * w+12, this.y * h+12,11,0,2*Math.PI);
		ctx.stroke();
		ctx.stroke();
		ctx.fill();
		}		
		else{
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.rect(this.x * w+1, this.y * h+1, w-2, h-2);
		ctx.stroke();
		ctx.stroke();
		ctx.fill();
		}
		
		ctx.fillStyle = "red";
		ctx.font = "12px Arial";
		if(this.wallHeight != 0){
			ctx.fillText(this.wallHeight, this.x * w+8.5, this.y * h+16);
		}
	}
	this.cameFrom = undefined;
	this.neighbours = [];
	this.addNeighbours = function(grid)
	{
		//Right
		if(x < col-1)
		{
			this.neighbours.push(grid[x+1][y]);
		}
		
		//Left
		if(x > 0)
		{
			this.neighbours.push(grid[x-1][y]);
		}
		
		//Down
		if(y < row-1)
		{
			this.neighbours.push(grid[x][y+1]);
		}
		
		//Up
		if(y > 0)
		{
			this.neighbours.push(grid[x][y-1]);
		}
	
		if(allowNeighbours)
		{
			//Top Left
			if(x > 0 && y > 0)
			{
				this.neighbours.push(grid[x-1][y-1]);
			}
			
			//Top Right
			if(x > 0 && y < row-1)
			{
				this.neighbours.push(grid[x-1][y+1]);
			}
			
			//Bottom Left
			if(x > col-1 && y > 0)
			{
				this.neighbours.push(grid[x+1][y-1]);
			}
			
			//Bottom Right
			if(x < col-1 && y < row-1)
			{
				this.neighbours.push(grid[x+1][y+1]);
			}			
		}
	}
}
	
function Setup()
{
	//Implementing the 2D array by making every column have a set ammout of rows
	for(var x = 0; x < col; x++)
	{
		grid[x] = new Array(row);
	}
	
	//Populating the array with Cells
	for(var x = 0; x < col; x++)
	{
		for(var y = 0; y < row; y++)
		{
			grid[x][y] = new Cell(x,y);
		}
	}
	
	//Adding every neighbour for every cell
	for(var x = 0; x < col; x++)
	{
		for(var y = 0; y < row; y++)
		{
			grid[x][y].addNeighbours(grid);
		}
	}
	
	//Asigning the start and end point
	start = grid[0][0];
	end = grid[col-1][row-1];

	//Making the start and finish not a wall by default
	start.wallHeight = 0;
	end.wallHeight = 0;


	//Start the search from the start
	openSet.push(start);
}

function Update()
{
	if(openSet.length > 0)
	{
		var lowestIndex = 0;
		for(var x = 0; x < openSet.length; x++)
		{
			if(openSet[x].f < openSet[lowestIndex].f)
			{
				lowestIndex = x;
			}
		}
		var current = openSet[lowestIndex];
		
		//The algorithm got to the end cell so add the path to the array and return
		if(current === end)	
		{
			console.log("lmao?");
			
			Ending = true;
		}
		
		//Javascript is dumb and it can't remove an object from a container by default ;(
		removeArrayObject(openSet, current);
		closedSet.push(current);
		
		//Storing the neighbours for the current cell (the one with the best "f" score)
		var neighbours = current.neighbours;
		for(var x = 0; x < neighbours.length; x++)
		{
			//For every neighbour IF it's not a wall that you can pass over calculate its
			//cost until the end, and the cost it will take to get to this neighbour (added together its the "f" score)
			var currentNeighbour = neighbours[x];
			if(!closedSet.includes(currentNeighbour) && currentNeighbour.wallHeight <= maxHeight)
			{
				var newPathFound = false;
				var tempGscore = current.g + 1;
				if(openSet.includes(currentNeighbour))
				{
					if(tempGscore < currentNeighbour.g)
					{
						newPathFound = true;
						currentNeighbour.g = tempGscore;
					}
				}else{
					newPathFound = true;
					currentNeighbour.g = tempGscore;
					openSet.push(currentNeighbour);
				}
				
				if(newPathFound)
				{
					if(currentHeuristic == 0){currentNeighbour.h = HeuristicOne(currentNeighbour, end);}
					if(currentHeuristic == 1){currentNeighbour.h = HeuristicTwo(currentNeighbour, end);}
					if(currentHeuristic == 2){currentNeighbour.h = HeuristicThree(currentNeighbour, end);}
					
					currentNeighbour.f = currentNeighbour.g + currentNeighbour.h;
					currentNeighbour.cameFrom = current;
				}
				
			}
		}
		
		astarPath = [];
		var tempCell = current;
		astarPath.push(tempCell);
		while(tempCell.cameFrom)
		{
			astarPath.push(tempCell.cameFrom);
			tempCell = tempCell.cameFrom;
		}
		
	} else
	{
		notFinal = true;
		Ending = true;
		ctx.drawImage(noPathImg, 0, 0, 1000, 1000);
		counter = 0;
		//No sol
	}		
	
}

function Draw()
{		
    for(var x = 0; x < Images.length; x++)
    {
        ctx1.drawImage(Images[x], 0, x*90+10, 80, 80);
    }

	for(var x = 0; x < col; x++)
	{
		for(var y = 0; y < row; y++)
		{
			if(grid[x][y].wallHeight == 0)
			{
				grid[x][y].drawCell("white");

			}
			else if(grid[x][y].wallHeight == 1)
			{
				grid[x][y].drawCell("PowderBlue");
			}
			else if(grid[x][y].wallHeight == 2)
			{
				grid[x][y].drawCell("SlateGrey");
			}
			else if(grid[x][y].wallHeight == 3)
			{
				grid[x][y].drawCell("Black");
			}
		}
	}
	
	if(drawSearch)
	{
		for(var x = 0; x < openSet.length; x++)
		{
			openSet[x].drawCell("green");
		}
		
		for(var x = 0; x < closedSet.length; x++)
		{
			closedSet[x].drawCell("red");
		}
	}	
	
	grid[0][0].drawCell("green");
	grid[col-1][row-1].drawCell("pink")
	
	for(var x = astarPath.length-1; x > 0; x--)
	{
		astarPath[x].drawCell("blue");
	}
	
	var heuristicName = "";
	if(currentHeuristic == 0){heuristicName = "Euclidian";}
	if(currentHeuristic == 1){heuristicName = "Manhattan";}
	if(currentHeuristic == 2){heuristicName = "Optimised";}
	
	//Draw the text on the right of the screen
	ctx2.clearRect(0,0,400,400);
	ctx2.font = "30px Impact";
	ctx2.fillText("Current Maximum Height " + maxHeight.toString(), 0, 50);
	ctx2.fillText("Allow diagonals " + allowNeighbours.toString(), 0, 90);
	ctx2.fillText("Current Heuristic " + heuristicName, 0, 130);
	ctx2.fillText("Seconds passed " + Math.floor(counter/46) + "s", 0, 170);
	
}

function getPosition(event)
      {
        var x = event.x;
        var y = event.y;
        var canvas = document.getElementById("Height");
		x -= canvas.offsetLeft;
        y -= canvas.offsetTop;		
		
        if(x < 80 && y < 80)
        {
    		isMapRandom = false;
    		heightMapData = [];
    	    cellHeightArray = [];
            createHeight(img);
            currentHeightMap = img;
        }
        
        if(x < 80 && y > 90)
        {
            if(y < 170)
            {
                isMapRandom = false;
                heightMapData = [];
    	        cellHeightArray = [];
                createHeight(img2);
                currentHeightMap = img2;
            }
        }
        
        if(x < 80 && y > 180)
        {
            if(y < 260)
            {
                isMapRandom = false;
    		    heightMapData = [];
    	        cellHeightArray = [];
                createHeight(img3);
                currentHeightMap = img3;
            }
        }
        
        if(x < 80 && y > 270)
        {
            if(y < 350)
            {
                isMapRandom = false;
    		    heightMapData = [];
    	        cellHeightArray = [];
                createHeight(img4);
                currentHeightMap = img4;
            }
        }
        
        if(x < 80 && y > 360)
        {
            if(y < 440)
            {
                isMapRandom = false;
    	    	heightMapData = [];
    	        cellHeightArray = [];
                createHeight(img5);
                currentHeightMap = img5;
            }
        }
        
        if(x < 80 && y > 450)
        {
            if(y < 530)
            {
                isMapRandom = false;
    	    	heightMapData = [];
    	        cellHeightArray = [];
                createHeight(img6);
                currentHeightMap = img6;
            }
        }
        
        if(x < 80 && y > 540)
        {
            if(y < 620)
            {
                isMapRandom = false;
    		    heightMapData = [];
    	        cellHeightArray = [];
                createHeight(img7);
                currentHeightMap = img7;
            }
        }
        
        if(x < 80 && y > 630)
        {
            if(y < 710)
            {
                isMapRandom = false;
    		    heightMapData = [];
    	        cellHeightArray = [];
                createHeight(img8);
                currentHeightMap = img8;
            }
        }
        
        MakeMap();
        SetupHeightMap();
		Draw();
		Reset();
		
      }

function Timer()
{
	counter++;
}
	  
function AIMain()
{
	if(!Ending && !notFinal)
	{
		Update();    
		ctx.clearRect(0, 0, 1000, 1000);
		Draw();
		Timer();
		setTimeout(AIMain, 16.6);
	}
	else if (Ending && notFinal)
	{
		ctx.drawImage(noPathImg, 0, 0, ctx.width, ctx.height);
	}	  
}