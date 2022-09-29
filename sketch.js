/*

In my game project I created three extensions. I added sounds, platforms and enemies.
The sounds were specific for an action in the game such as the character jumping,
plummeting, collecting a collectable item and getting in contact with an enemy. 
I also incorporated sounds for game over and completion of the level.
I used the factory pattern to create platforms at different stages of the game
to aid the game character in navigation.
I also constructed enemies posted at different parts of the game, often guarding the 
collectables and posing a danger to the game character.
During the process of creating the game, I found using loops challenging,
especially nested loops. Sometimes the program would not work as I expected or 
refuse to run altogether.
Despite that tackling these problems has really helped me improve my skills not only in
coding but as well as looking for and interpreting solutions online and being able to visualize
the code in my head to understand how it's working.

*/
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

var platforms;

var enemies;

var jumpSound;
var fallSound;
var collectableSound;
var completedSound;
var gameoverSound;
var backgroundSound;
var enemySound;

var scoreImage;
var livesImage;

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

	enemySound = loadSound('assets/enemy.wav');
    enemySound.setVolume(0.05);

    backgroundSound = loadSound('assets/background.wav');
    backgroundSound.setVolume(0.05);

	scoreImage = loadImage('assets/score.png');
	livesImage = loadImage('assets/lives.png');
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

	//Draw platforms
	for(var i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
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

	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].draw();

		var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y)

		if(isContact)
		{
			if(lives > 0)
			{
				lives -= 1;
				startGame();
				break;
			}
		}
	}

	pop();

	// Draw game character.	
	drawGameChar();

	fill(0);
	noStroke();
	textSize(20);
	text("X " + game_score, 65, 35);
	image(scoreImage, 30, 10);
	if(lives > 0)
	{
		image(livesImage, 25, 60)
		text("X " + lives, 70, 90);
	}
	

	checkPlayerDie();

	if(lives < 1)
	{
		fill(255);
		noStroke();
		textSize(30);
		text("Game Over!! Try Again.", 300, height/2);
        backgroundSound.stop();
		return
	}
	
	if(flagpole.isReached)
	{
		
		fill(255);
		noStroke();
		textSize(30);
		text("Level complete. Press space to continue.", 200, height/2);
		return
	}
	if(flagpole.isReached == false)
	{
		checkFlagpole();
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
	if (gameChar_y < floorPos_y)
	{
		var isContact = false;
		for(var i = 0; i < platforms.length; i++)
		{
			if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
			{
				isContact = true;
			}
		}
		if(isContact == false)
		{
			gameChar_y += 2;
			isFalling = true;
		}
		else 
		{
			isFalling = false;
		}		
	}
	else 
	{
		isFalling = false;
	}

	if (isPlummeting)
    {
        gameChar_y += 4;
        backgroundSound.stop();
        fallSound.playMode('untilDone');
        fallSound.play();
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
	if (keyCode == 32 && isFalling == false)
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
		//Feet
		stroke(0);
		fill(64);
		ellipse(gameChar_x - 3 , gameChar_y - 5, 9, 13);
		fill(0);
		ellipse(gameChar_x , gameChar_y - 4, 9, 13);
		//Body
		fill(0);
		ellipse(gameChar_x, gameChar_y - 27, 30, 39);
		fill(255);
		ellipse(gameChar_x, gameChar_y - 23, 30, 24);	
		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 51, 28, 30);
		//Hands
		fill(0);
		stroke(0);
		ellipse(gameChar_x + 2 , gameChar_y - 40, 8, 18);
		//ears
		fill(64);
		ellipse(gameChar_x - 2, gameChar_y - 68, 9, 10);
		fill(0);
		ellipse(gameChar_x, gameChar_y - 66, 9, 10);
		//Eyes
		fill(0);
		ellipse(gameChar_x - 8 , gameChar_y - 52, 11, 13);
		fill(255);
		ellipse(gameChar_x - 8 , gameChar_y - 52, 6, 6);
		fill(0);
		ellipse(gameChar_x - 9 , gameChar_y - 52, 1, 1);
		//Nose
		ellipse(gameChar_x  - 13, gameChar_y - 43, 4, 3);
		//Smile
		fill(0);
		ellipse(gameChar_x - 7, gameChar_y - 41, 7, 3);			


	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		//Feet
		stroke(0);
		fill(64);
		ellipse(gameChar_x + 3 , gameChar_y - 5, 9, 13);
		fill(0);
		ellipse(gameChar_x , gameChar_y - 4, 9, 13);
		//Body
		fill(0);
		ellipse(gameChar_x, gameChar_y - 27, 30, 39);
		fill(255);
		ellipse(gameChar_x, gameChar_y - 23, 30, 24);	
		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 51, 28, 30);
		//Hands
		fill(0);
		stroke(0);
		ellipse(gameChar_x -2 , gameChar_y - 40, 8, 18);
		//ears
		fill(64);
		ellipse(gameChar_x + 2, gameChar_y - 68, 9, 10);
		fill(0);
		ellipse(gameChar_x, gameChar_y - 66, 9, 10);
		//Eyes
		fill(0);
		ellipse(gameChar_x + 8 , gameChar_y - 52, 11, 13);
		fill(255);
		ellipse(gameChar_x + 8 , gameChar_y - 52, 6, 6);
		fill(0);
		ellipse(gameChar_x + 9 , gameChar_y - 52, 1, 1);
		//Nose
		ellipse(gameChar_x  + 13, gameChar_y - 43, 4, 3);
		
	}
	else if(isLeft)
	{
		// add your walking left code
		stroke(0);
		fill(64);
	 	ellipse(gameChar_x -3 , gameChar_y - 5, 13, 9);
		fill(0);
		ellipse(gameChar_x , gameChar_y - 4, 13, 9);
	 	//Body
	 	fill(0);
	 	ellipse(gameChar_x, gameChar_y - 27, 30, 39);
	 	fill(255);
	 	ellipse(gameChar_x, gameChar_y - 23, 30, 24);	
	 	//Hands
	 	fill(0);
	 	stroke(0);
	 	ellipse(gameChar_x + 2 , gameChar_y - 27, 8, 18);
	 	//Head
		fill(255);
	 	ellipse(gameChar_x, gameChar_y - 51, 28, 30);
	 	//ears
	 	fill(64);
	 	ellipse(gameChar_x -2, gameChar_y - 68, 9, 10);
	 	fill(0);
	 	ellipse(gameChar_x, gameChar_y - 66, 9, 10);
	 	//Eyes
	 	fill(0);
	 	ellipse(gameChar_x - 8 , gameChar_y - 52, 11, 13);
	 	fill(255);
	 	ellipse(gameChar_x - 8 , gameChar_y - 52, 6, 6);
	 	fill(0);
	 	ellipse(gameChar_x - 9 , gameChar_y - 52, 1, 1);
	 	//Nose
	 	ellipse(gameChar_x  - 13, gameChar_y - 43, 4, 3);	
	 	//Smile
	 	noFill();
	 	stroke(0);
	 	arc(gameChar_x - 8, gameChar_y - 44, 10, 10, 0, HALF_PI);
 

	}
	else if(isRight)
	{
		// add your walking right code
		//Feet
		stroke(0);
		fill(64);
		ellipse(gameChar_x + 3 , gameChar_y - 5, 13, 9);
		fill(0);
		ellipse(gameChar_x , gameChar_y - 4, 13, 9);
		//Body
		fill(0);
		ellipse(gameChar_x, gameChar_y - 27, 30, 39);
		fill(255);
		ellipse(gameChar_x, gameChar_y - 23, 30, 24);	
		//Hands
		fill(0);
		stroke(0);
		ellipse(gameChar_x - 2, gameChar_y - 27, 8, 18);
		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 51, 28, 30);
		//ears
		fill(64);
		ellipse(gameChar_x + 2, gameChar_y - 68, 9, 10);
		fill(0);
		ellipse(gameChar_x, gameChar_y - 66, 9, 10);
		//Eyes
		fill(0);
		ellipse(gameChar_x + 8 , gameChar_y - 52, 11, 13);
		fill(255);
		ellipse(gameChar_x + 8 , gameChar_y - 52, 6, 6);
		fill(0);
		ellipse(gameChar_x + 9 , gameChar_y - 52, 1, 1);
		//Nose
		ellipse(gameChar_x  + 13, gameChar_y - 43, 4, 3);
		//Smile
		noFill();
		stroke(0);
		arc(gameChar_x + 8, gameChar_y - 44, 10, 10, HALF_PI, PI);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		//Hands	
		fill(0);
		stroke(0);
		ellipse(gameChar_x - 19, gameChar_y - 40, 8, 18);
		ellipse(gameChar_x + 19, gameChar_y - 40, 8, 18);
		//Body
		ellipse(gameChar_x, gameChar_y - 27, 35, 39);
		fill(255);
		ellipse(gameChar_x, gameChar_y - 23, 35, 24);
		//ears
		fill(0);
		ellipse(gameChar_x - 13 , gameChar_y - 62, 10, 10);
		ellipse(gameChar_x + 13 , gameChar_y - 62, 10, 10);
		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 51, 34, 30);
		//Eyes
		fill(0);
		ellipse(gameChar_x - 8 , gameChar_y - 52, 10, 13);
		ellipse(gameChar_x + 8 , gameChar_y - 52, 10, 13);
		fill(255);
		ellipse(gameChar_x - 6 , gameChar_y - 50, 6, 6);
		ellipse(gameChar_x + 6 , gameChar_y - 50, 6, 6);
		fill(0);
		ellipse(gameChar_x - 6 , gameChar_y - 50, 1, 1);
		ellipse(gameChar_x + 6 , gameChar_y - 50, 1, 1);
		//Nose
		ellipse(gameChar_x  , gameChar_y - 45, 4, 3);
		//Smile
		fill(0);
		ellipse(gameChar_x, gameChar_y - 40, 10, 4);
		//Feet
		fill(0);
		ellipse(gameChar_x - 10, gameChar_y - 7, 8, 12);
		ellipse(gameChar_x + 10, gameChar_y - 7, 8, 12);

	}
	else
	{
		// add your standing front facing code
	
		//Hands
		fill(0);
		stroke(0);
		ellipse(gameChar_x - 19, gameChar_y - 35, 18, 8);
		ellipse(gameChar_x + 19, gameChar_y - 35, 18, 8);
		//Body
		ellipse(gameChar_x, gameChar_y - 25, 35, 39);
		fill(255);
		ellipse(gameChar_x, gameChar_y - 21, 35, 24);
		//ears
		fill(0);
		ellipse(gameChar_x - 13 , gameChar_y - 60, 10, 10);
		ellipse(gameChar_x + 13 , gameChar_y - 60, 10, 10);
		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 49, 34, 30);
		//Eyes
		fill(0);
		ellipse(gameChar_x - 8 , gameChar_y - 50, 10, 13);
		ellipse(gameChar_x + 8 , gameChar_y - 50, 10, 13);
		fill(255);
		ellipse(gameChar_x - 6 , gameChar_y - 48, 6, 6);
		ellipse(gameChar_x + 6 , gameChar_y - 48, 6, 6);
		fill(0);
		ellipse(gameChar_x - 6 , gameChar_y - 48, 1, 1);
		ellipse(gameChar_x + 6 , gameChar_y - 48, 1, 1);
		//Nose
		ellipse(gameChar_x  , gameChar_y - 43, 4, 3);
		//Smile
		noFill();
		stroke(0);
		arc(gameChar_x - 3, gameChar_y - 42, 6, 6, 0, PI);
		arc(gameChar_x + 3, gameChar_y - 42, 6, 6, 0, PI);	
		//Feet
		fill(0);
		ellipse(gameChar_x - 10, gameChar_y - 5, 12, 8);
		ellipse(gameChar_x + 10, gameChar_y - 5, 12, 8);

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
	if (abs(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos)) < 40)
    {
        t_collectable.isFound = true;
		game_score += 1;
        collectableSound.play();
    }

}

// Function to draw platforms.
function createPlatforms(x, y, length, grassHeight)
{
	var p = {
		x: x,
		y: y,
		length: length,
		grassHeight: grassHeight,
		draw: function(){
			fill(0, 102, 0);
			rect(this.x, this.y - 5, this.length, 5);
			fill(153, 76, 0);
			rect(this.x, this.y, this.length, 20);			
		},
		checkContact: function(gc_x, gc_y){
			if(gc_x > this.x && gc_x < this.x + this.length)
			{
				var d = this.y - gc_y;
				if(d >= 0 && d < 3)
				{
					return true;
				}
			}
			return false;
		}
	}
	return p;
}

function Enemy(x, y, range)
{
	this.x = x;
	this.y = y;
	this.range = range;

	this.currentX = x;
	this.inc = 1;

	this.update = function()
	{
		this.currentX += this.inc;

		if(this.currentX >= this.x + this.range)
		{
			this.inc -= 1;
		}
		else if(this.currentX < this.x)
		{
			this.inc = 1;
		}

	}
	this.draw = function()
	{
		this.update();
		//Hands
		fill(32);
		noStroke();
		ellipse(this.currentX - 14, this.y - 14, 10, 5);
		ellipse(this.currentX + 13, this.y - 11, 5, 10);
		//Feet
		ellipse(this.currentX - 6, this.y - 2, 9, 7);
		ellipse(this.currentX + 6, this.y - 2, 9, 7);
		//Ears
		triangle(this.currentX - 9 , this.y - 21 ,
				this.currentX - 11, this.y - 28,
				this.currentX - 6, this.y - 24,);
		triangle(this.currentX + 9 , this.y - 21 ,
				this.currentX + 11, this.y - 28,
				this.currentX + 6, this.y - 24,);
		//Body	
		fill(153, 76, 0);
		ellipse(this.currentX, this.y - 14, 23, 23);
		//Eyes
		fill(255);
		ellipse(this.currentX - 5 , this.y - 14, 6, 4);
		ellipse(this.currentX + 5 , this.y - 14, 6, 4);
		fill(0);
		ellipse(this.currentX - 5 , this.y - 14, 3, 3);
		ellipse(this.currentX + 5 , this.y - 14, 3, 3);
		//Teeth
		fill(255);
		triangle(this.currentX - 4, this.y - 8,
			this.currentX - 2, this.y - 5,
			this.currentX, this.y - 8);
		triangle(this.currentX, this.y - 8,
			this.currentX + 2, this.y - 5,
			this.currentX + 4, this.y - 8);
		//Spear
		fill(153, 76, 0);
		rect(this.currentX - 16 , this.y - 20, 2, 21);
		fill(0);
		triangle(this.currentX - 18, this.y - 20,
				this.currentX - 15, this.y - 26,
				this.currentX - 12, this.y - 20);
		//Brows
		noFill();
		stroke(0);
		line(this.currentX - 6 , this.y - 20 ,this.currentX - 3, this.y - 17);
		line(this.currentX + 6 , this.y - 20 ,this.currentX + 3, this.y - 17);
		line(this.currentX -6 , this.y - 9 ,this.currentX + 6, this.y - 9);
	}
	this.checkContact = function(gc_x, gc_y)
	{
		var d = dist(gc_x, gc_y, this.currentX, this.y)
		if(d < 35)
		{
			backgroundSound.stop();
			enemySound.play();
			return true;
		}
		return false;
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
	gameChar_x = 60;
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
	trees_x = [100, 350, 650, 1400, 1700, 2000, 2510, 2800, 3350];
	clouds = [
		{x_pos: 140, y_pos: 100},
		{x_pos: 280, y_pos: 50},
		{x_pos: 700, y_pos: 120},
		{x_pos: 1100, y_pos: 70},
		{x_pos: 1250, y_pos: 40},
		{x_pos: 1650, y_pos: 120},
		{x_pos: 2080, y_pos: 50},
		{x_pos: 2180, y_pos: 120},
		{x_pos: 2500, y_pos: 100},
		{x_pos: 2880, y_pos: 70},
		{x_pos: 3000, y_pos: 120},
		{x_pos: 3400, y_pos: 100},
	];
	mountains = [
		{x_pos: 420, y_pos: 200},
		{x_pos: 800, y_pos: 200},
		{x_pos: 1450, y_pos: 200},
		{x_pos: 2300, y_pos: 200},
		{x_pos: 2900, y_pos: 200}

	];
	canyons = [
		{x_pos: 240, width: 100},
		{x_pos: 1100, width: 200},
		{x_pos: 1250, width: 100},
		{x_pos: 1800, width: 100},
		{x_pos: 2100, width: 100},
		{x_pos: 2650, width: 100},
	];
	collectables = [ 
		{x_pos: 150, y_pos: floorPos_y - 35, isFound: false},
		{x_pos: 870, y_pos: floorPos_y - 35, isFound: false},
		{x_pos: 1280, y_pos: floorPos_y - 160, isFound: false},
		{x_pos: 1600, y_pos: floorPos_y - 35, isFound: false},
		{x_pos: 2270, y_pos: floorPos_y - 160, isFound: false},
		{x_pos: 2550, y_pos: floorPos_y - 35, isFound: false},
		{x_pos: 3130, y_pos: floorPos_y - 110, isFound: false},
	];

	platforms = [];

	platforms.push(createPlatforms(1100, floorPos_y - 70, 100));
	platforms.push(createPlatforms(1250, floorPos_y - 120, 100));
	platforms.push(createPlatforms(2100, floorPos_y - 70, 100));
	platforms.push(createPlatforms(2250, floorPos_y - 120, 200));
	platforms.push(createPlatforms(3100, floorPos_y - 70, 100));


	enemies = [];

	enemies.push(new Enemy(700, floorPos_y - 3, 100));
	enemies.push(new Enemy(1450, floorPos_y - 3, 100));
	enemies.push(new Enemy(2320, floorPos_y - 125, 100));
	enemies.push(new Enemy(3150, floorPos_y - 3, 100));


	game_score = 0;

	flagpole = {isReached: false, x_pos: 3600};

}
