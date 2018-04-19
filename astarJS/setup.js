function IncreaseHeight()
{
	Ending = false;
	maxHeight += 1;
	openSet = [];
	closedSet = [];
	astarPath = [];
	counter = 0;
	notFinal = false;
	
	start = grid[0][0];
	end = grid[col-1][row-1];
	openSet.push(start);
	
	Draw();
}

function DecreaseHeight()
{
	Ending = false;
	maxHeight -= 1;
	openSet = [];
	closedSet = [];
	astarPath = [];
	counter = 0;
	notFinal = false;
	
	start = grid[0][0];
	end = grid[col-1][row-1];
	openSet.push(start);
	
	Draw();
}

function NewMap()
{
	openSet = [];
	closedSet = [];
	astarPath = [];
	Ending = true;
	isMapRandom = true;
	counter = 0;
	notFinal = false;
	
	Setup();
	Draw();
}

function StartAI()
{
        Ending = false;
    	AIMain();
}

function StopAI()
{
	Ending = true;
	notFinal = false;
}

function DrawCircles()
{
	if(!drawCircles){drawCircles = true;}
	else{drawCircles = false;}
	
	ctx.clearRect(0,0,ctx.width,ctx.height);
	Draw();
}

function Allow()
{
	if(allowNeighbours){allowNeighbours = false;}
		else{allowNeighbours = true;}
	
	if(isMapRandom)
	{
	    Setup();
	    Draw();
	}
	else
	{
	    createHeight(currentHeightMap);
    	MakeMap();
	    SetupHeightMap();
		Draw();
	}
	
	openSet = [];
	closedSet = [];
	astarPath = [];	
	counter = 0;
	
	notFinal = false;
	openSet.push(start);
	Ending = true;
	ctx.clearRect(0,0,ctx.width,ctx.height);
	Draw();
}

function Reset()
{
	openSet = [];
	closedSet = [];
	astarPath = [];
	maxHeight = 0;
	counter = 0;
	
	notFinal = false;
	openSet.push(start);
	Ending = true;
	ctx.clearRect(0,0,ctx.width,ctx.height);
	Draw();
}

function Search()
{
	if(drawSearch){drawSearch = false;}
		else{drawSearch = true;}
		
	Draw();
}

function SelectHeuristic(val)
{
	currentHeuristic = val;
	
	openSet = [];
	closedSet = [];
	astarPath = [];	
	counter = 0;
	
	notFinal = false;
	openSet.push(start);
	Ending = true;
	ctx.clearRect(0,0,ctx.width,ctx.height);
	Draw();
}