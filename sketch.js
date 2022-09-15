
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var game_score;
var flagpole;
var lives;

var jumpSound;
var fallSound;
var collectableSound;
var completedSound;
var gameoverSound;
var backgroundSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);

    fallSound = loadSound('assets/fall.wav');
    fallSound.setVolume(0.1);

    collectableSound = loadSound('assets/collectable.wav');
    collectableSound.setVolume(0.1);

    completedSound = loadSound('assets/levelCompleted.wav');
    completedSound.setVolume(0.1);

    gameoverSound = loadSound('assets/gameOver.wav');
    gameoverSound.setVolume(0.1);

    backgroundSound = loadSound('assets/background.wav');
    backgroundSound.setVolume(0.05);
}


function setup()
{
	createCanvas(1024, 576);

    floorPos_y = height * 3/4;
	
	lives = 3;

	startGame();
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

	push();
	translate(scrollPos, 0);
	// Draw clouds.
	drawClouds();

	// Draw mountains.
	drawMountains();

	// Draw trees.
	drawTrees();

	// Draw canyons.
	for(var i = 0; i < canyons.length; i++)
	{
		drawCanyons(canyons[i]);
		checkCanyons(canyons[i]);
	}

	// Draw collectable items.
	for(var i = 0; i < collectables.length; i++)
	{
		if(collectables[i].isFound == false)
		{
			drawCollectables(collectables[i]);
			checkCollectables(collectables[i]);
		}	
	}

	renderFlagpole();

	pop();

	// Draw game character.	
	drawGameChar();

	fill(0);
	noStroke();
	textSize(18);
	text("score: " + game_score, 30, 30);
	if(lives > 0)
	{
		text("lives: " + lives, 30, 55);
	}
	

	checkPlayerDie();

	if(lives < 1)
	{
		fill(255);
		noStroke();
		textSize(30);
		text("Game Over!! Press space to continue", 200, height/2);
        backgroundSound.stop();
		return
	}
	
	if(flagpole.isReached == true)
	{
		
		fill(255);
		noStroke();
		textSize(30);
		text("Level complete. Press space to continue.", 200, height/2);
		return
	}

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 3;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 3;
		}
		else
		{
			scrollPos -= 3; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
	if (gameChar_y != floorPos_y)
	{
		gameChar_y += 2;
		isFalling = true;

	}
	else
	{
		isFalling = false;
	}

	if (isPlummeting == true)
    {
        gameChar_y += 2;
        backgroundSound.stop();
        fallSound.playMode('untilDone');
        fallSound.play();
    }

	if(flagpole.isReached == false)
	{
		checkFlagpole();
	}

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.
	if (keyCode == 37)
	{
		isLeft = true;
	}
	else if (keyCode == 39)
	{
		isRight = true;
	}
	if (keyCode == 32 && gameChar_y == floorPos_y)
	{
		gameChar_y -= 100;
        jumpSound.play();
	}
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
	if (keyCode == 37)
	{
		isLeft = false;
	}
	else if (keyCode == 39)
	{
		isRight = false;
	}
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		//Head
		fill(204, 102, 0);
		ellipse(gameChar_x, gameChar_y - 50, 20, 20);
		//Body
		fill(153, 0, 76);
		rect(gameChar_x -10, gameChar_y - 40, 20, 30);
		//Feet
		fill(0);
		ellipse(gameChar_x -4, gameChar_y - 5, 18, 12);
		//Hands
		rect(gameChar_x -3, gameChar_y - 60, 8, 22);
		//Eyes
		ellipse(gameChar_x - 4 , gameChar_y - 53, 4, 4);


	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		//Head
		fill(204, 102, 0);
		ellipse(gameChar_x, gameChar_y - 50, 20, 20);
		//Body
		fill(153, 0, 76);
		rect(gameChar_x -10, gameChar_y - 40, 20, 30);	
		//Feet
		fill(0);
		ellipse(gameChar_x +4, gameChar_y - 5, 18, 12);
		//Hands
		rect(gameChar_x -5, gameChar_y - 60, 8, 22);
		//Eyes
		ellipse(gameChar_x + 4 , gameChar_y - 53, 4, 4);


	}
	else if(isLeft)
	{
		// add your walking left code
		//Head
		fill(204, 102, 0);
		ellipse(gameChar_x, gameChar_y - 50, 20, 20);
		//Body
		fill(153, 0, 76);
		rect(gameChar_x -10, gameChar_y - 40, 20, 30);
		//Feet
		fill(0);
		ellipse(gameChar_x -4, gameChar_y - 5, 18, 12);
		//Hands
		rect(gameChar_x -3, gameChar_y - 40, 8, 22);
		//Eyes
		ellipse(gameChar_x - 3 , gameChar_y - 53, 4, 4);
		//Smile
		noFill();
		stroke(0);
		arc(gameChar_x - 5, gameChar_y - 49, 10, 10, 0, HALF_PI);

	}
	else if(isRight)
	{
		// add your walking right code
		//Head
		fill(204, 102, 0);
		ellipse(gameChar_x, gameChar_y - 50, 20, 20);
		//Body
		fill(153, 0, 76);
		rect(gameChar_x -10, gameChar_y - 40, 20, 30);
		//Feet
		fill(0);
		ellipse(gameChar_x +4, gameChar_y - 5, 18, 12);
		//Hands
		rect(gameChar_x -5, gameChar_y - 40, 8, 22);
		//Eyes
		ellipse(gameChar_x + 3 , gameChar_y - 53, 4, 4);
		//Smile
		noFill();
		stroke(0);
		arc(gameChar_x + 5, gameChar_y - 49, 10, 10, HALF_PI, PI);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		//Head
		fill(204, 102, 0);
		ellipse(gameChar_x, gameChar_y - 50, 20, 20);
		//Body
		fill(153, 0, 76);
		rect(gameChar_x -12, gameChar_y - 40, 25, 30);
		//Feet
		fill(0);
		ellipse(gameChar_x - 8, gameChar_y - 5, 15, 10);
		ellipse(gameChar_x + 8, gameChar_y - 5, 15, 10);
		//Hands
		rect(gameChar_x - 18, gameChar_y - 60, 8, 22);
		rect(gameChar_x + 10, gameChar_y - 60, 8, 22);
		//Eyes
		ellipse(gameChar_x - 3 , gameChar_y - 53, 4, 4);
		ellipse(gameChar_x + 3 , gameChar_y - 53, 4, 4);
		//Smile
		fill(0);
		ellipse(gameChar_x, gameChar_y - 46, 10, 5);

	}
	else
	{
		// add your standing front facing code
		//Head
		fill(204, 102, 0);
		ellipse(gameChar_x, gameChar_y - 50, 20, 20);
		//Body
		fill(153, 0, 76);
		rect(gameChar_x -12, gameChar_y - 40, 25, 30);
		//Feet
		fill(0);
		ellipse(gameChar_x - 8, gameChar_y - 5, 15, 10);
		ellipse(gameChar_x + 8, gameChar_y - 5, 15, 10);
		//Hands
		rect(gameChar_x - 18, gameChar_y - 40, 8, 22);
		rect(gameChar_x + 10, gameChar_y - 40, 8, 22);
		//Eyes
		ellipse(gameChar_x - 3 , gameChar_y - 53, 4, 4);
		ellipse(gameChar_x + 3 , gameChar_y - 53, 4, 4);
		//Smile
		noFill();
		stroke(0);
		arc(gameChar_x, gameChar_y - 49, 10, 10, 0, PI);

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
	for(var i = 0; i < clouds.length; i++)
	{
		fill(255, 255, 255);
    	ellipse(clouds[i].x_pos, clouds[i].y_pos, 80, 70);
    	ellipse(clouds[i].x_pos - 44, clouds[i].y_pos + 15, 58, 53);
    	ellipse(clouds[i].x_pos + 44, clouds[i].y_pos + 15, 58, 53);
    	rect(clouds[i].x_pos - 50, clouds[i].y_pos + 21, 100, 20);

	}
}

// Function to draw mountains objects.
function drawMountains()
{
	for(var i = 0; i < mountains.length; i++)
	{
		fill(99, 99, 99);
		triangle(mountains[i].x_pos, floorPos_y, 
			mountains[i].x_pos + 250, floorPos_y, 
			mountains[i].x_pos + 125, mountains[i].y_pos);
		fill(96, 96, 96);
		triangle(mountains[i].x_pos - 50, floorPos_y, 
			mountains[i].x_pos + 200, floorPos_y, 
			mountains[i].x_pos + 75, mountains[i].y_pos - 30);
	}
}

// Function to draw trees objects.
function drawTrees()
{
	for(var i = 0; i < trees_x.length; i++)
	{
		//trunk
		fill(102, 51, 0);
		rect(trees_x[i], floorPos_y - 144, 40, 145);
		//branches
		fill(0, 102, 0);
		ellipse(trees_x[i] + 20, floorPos_y - 200, 130, 100);
		ellipse(trees_x[i] - 10, floorPos_y - 150, 85, 100);
		ellipse(trees_x[i] + 50, floorPos_y - 150, 85, 100);

	}
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyons(t_canyon)
{
	fill(100, 155, 255);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 144);
}

// Function to check character is over a canyon.

function checkCanyons(t_canyon)
{	
    if (gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width
        && gameChar_y == floorPos_y)
    {
        isPlummeting = true;
    }
}

function renderFlagpole()
{
	push();
	strokeWeight(5);
	stroke(50);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
		
	fill(200);
	noStroke();

	if(flagpole.isReached)
	{
		rect(flagpole.x_pos,floorPos_y - 250, 50, 50);
	}
	else
	{
		rect(flagpole.x_pos,floorPos_y - 50, 50, 50);
	}

	pop();
}

function checkFlagpole()
{
	var d = abs(gameChar_world_x - flagpole.x_pos);

	if(d < 15)
	{
		flagpole.isReached = true;
        backgroundSound.stop();
        completedSound.play();
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectables(t_collectable)
{
	fill(255, 53, 53);
	triangle(t_collectable.x_pos, t_collectable.y_pos, 
		t_collectable.x_pos + 40, t_collectable.y_pos, 
		t_collectable.x_pos + 20, t_collectable.y_pos + 32);
	triangle(t_collectable.x_pos, t_collectable.y_pos, 
		t_collectable.x_pos + 40, t_collectable.y_pos, 
		t_collectable.x_pos + 20, t_collectable.y_pos - 20);
	fill(255, 102, 102);
	triangle(t_collectable.x_pos + 10, t_collectable.y_pos, 
		t_collectable.x_pos + 30, t_collectable.y_pos, 
		t_collectable.x_pos + 20, t_collectable.y_pos + 22);
	triangle(t_collectable.x_pos + 10, t_collectable.y_pos, 
		t_collectable.x_pos + 30, t_collectable.y_pos, 
		t_collectable.x_pos + 20, t_collectable.y_pos - 10);
}

// Function to check character has collected an item.

function checkCollectables(t_collectable)
{
	if (abs(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos)) < 30)
    {
        t_collectable.isFound = true;
		game_score += 1;
        collectableSound.play();
    }

}

function checkPlayerDie()
{
	if(gameChar_y > height)
	{
		lives -= 1;
		if(lives == 0)
		{
            gameoverSound.play();
			return
		}
		else
		{
			startGame(); 
		}
	}
}

function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    backgroundSound.loop();  

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
	trees_x = [60, 250, 550, 800, 1400];
	clouds = [
		{x_pos: 140, y_pos: 100},
		{x_pos: 280, y_pos: 50},
		{x_pos: 700, y_pos: 120},
		{x_pos: 1100, y_pos: 70},
		{x_pos: 1250, y_pos: 40},
	];
	mountains = [
		{x_pos: 320, y_pos: 200},
		{x_pos: 850, y_pos: 200},
		{x_pos: 1450, y_pos: 200}
	];
	canyons = [
		{x_pos: 140, width: 100},
		{x_pos: 620, width: 100},
		{x_pos: 1250, width: 100}
	];
	collectables = [
		{x_pos: 170, y_pos: 350, isFound: false},
		{x_pos: 650, y_pos: 350, isFound: false},
		{x_pos: 900, y_pos: 350, isFound: false},
		{x_pos: 1270, y_pos: 350, isFound: false}
	];

	game_score = 0;

	flagpole = {isReached: false, x_pos: 1800};

}
