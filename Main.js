/* global Phaser, Storage */

var score = 0;

// Define the 'startGame' object to encapsulate the game's starting logic.
var startGame = {
    // Preload function for loading game assets.
    preload: function () {
        // Load button spritesheets and click audio.
        game.load.spritesheet('button', 'img/play.png', 400, 200);
        game.load.spritesheet('button2', 'img/play_white.png', 400, 200);
        game.load.audio('click', 'sounds/click_one.mp3');
    },

    // Create function for initializing game settings and UI.
    create: function () {
        // Configure game scaling and alignment.
        configureGameScaling();

        // Set the background color of the game stage.
        game.stage.backgroundColor = '#555555';

        // Create the 'Play' button and configure its behavior.
        createPlayButton();

        // Load the click audio.
        loadClickSound();
    },

    // Function to configure game scaling and alignment.
    configureGameScaling: function () {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.setMinMax(100, 100, 450, 450);

        // Adjust game size for desktop devices.
        if (game.device.desktop) {
            game.scale.setGameSize(450, 450);
        }

        game.scale.refresh();
    },

    // Function to create and configure the 'Play' button.
    createPlayButton: function () {
        this.playButton = game.add.button(
            game.world.centerX - (game.cache.getImage('button').width / 2),
            game.world.centerY - (game.cache.getImage('button').height / 2),
            'button',
            this.startGameplay, // Callback function when the button is clicked.
            this
        );

        // Attach a callback for the button's click event.
        this.playButton.events.onInputDown.add(this.onPlayButtonDown, this);
    },

    // Function to load the click sound.
    loadClickSound: function () {
        this.clickSound = game.add.audio('click');
    },

    // Callback function for the 'Play' button click event.
    onPlayButtonDown: function () {
        // Create and display a new button when clicked.
        createSecondaryButton();
        console.log('Button down');
    },

    // Function to create and display a secondary button.
    createSecondaryButton: function () {
        this.secondaryButton = game.add.button(
            game.world.centerX - (game.cache.getImage('button2').width / 2),
            game.world.centerY - (game.cache.getImage('button2').height / 2),
            'button2',
            this.startGameplay, // Callback function when the secondary button is clicked.
            this, 0, 0, 1, 0
        );
    },

    // Callback function for the 'Play' button click event to start gameplay.
    startGameplay: function () {
        // Start the 'main' game state and play the click sound.
        game.state.start('main');
        this.clickSound.play();
    }
};

var mainState = {
    preload: function () {
        game.load.spritesheet('head_red', 'img/snake_red.png', 18, 18);
        game.load.spritesheet('head_green', 'img/snake_green.png', 18, 18);
        game.load.spritesheet('head_blue', 'img/snake_blue.png', 18, 18);
        game.load.spritesheet('head_orange', 'img/snake_orange.png', 18, 18);
        game.load.audio('eating', 'sounds/eating.mp3');
        game.load.audio('gameover', 'sounds/gameover.mp3');
        game.load.image('apple', 'img/apple.png');
        game.load.image('bg_darkgray_grid', 'img/background_darkgray_grid.png');
        game.load.image('bg_gray', 'img/background_gray.png');
        game.load.image('bg_darkblue', 'img/background_darkblue.png');
        game.load.image('bg_darkbrown_zigzag', 'img/background_darkbrown_zigzag.png');
        game.load.image('bg_darkred_grid', 'img/background_darkred_grid.png');
        game.load.image('bg_lightblue_mesh', 'img/background_lightblue_mesh.png');
        game.load.image('bg_purple_pixels', 'img/background_purple_pixels.png');
        game.load.image('bg_darkgreen_oldcanvas', 'img/background_darkgreen_oldcanvas.png');

        this.Direction = {'UP': 1, 'DOWN': 2, 'LEFT': 3, 'RIGHT': 4};
        this.currentDirection = Math.floor(Math.random()* 4) +1;
        this.player = [];
        this.speed = 18;
        this.lastUpdate = 0;
        this.updateSpeed = 120;
        this.keyUP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.keyDOWN = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.keyLEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.keyRIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.keyW = game.input.keyboard.addKey(Phaser.KeyCode.W);
        this.keyS = game.input.keyboard.addKey(Phaser.KeyCode.S);
        this.keyA = game.input.keyboard.addKey(Phaser.KeyCode.A);
        this.keyD = game.input.keyboard.addKey(Phaser.KeyCode.D);
        this.scoreText = null;
    },
    create: function () {
    // Create the tiled background with a random texture
    game.add.tileSprite(0, 0, 450, 450, this.randomBG());

    // Initialize the arcade physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Create and configure the apple sprite
    this.apple = game.add.sprite(144, 144, 'apple');
    this.apple_sound = game.add.audio('eating');

    // Initialize snake color and length
    this.color = this.randomSnake();
    for (var i = 0; i < 4; i++) {
        this.increaseLength();
    }
},
        create: function () {
    // Set up tap event handling
    game.input.onTap.add(this.touch, this);

    // Configure the style for the score text
    var textStyle = {
        fontSize: '15pt',
        fill: '#ffffff',
        boundsAlignH: 'center',
        stroke: '#303030',
        strokeThickness: 4
    };

    // Create and initialize the score text
    this.scoreText = game.add.text(0, 5, '', textStyle);
    this.updateScore();
},

    randomSnake: function () {
    // Define an array of available snake head colors
    var colors = ['head_red', 'head_blue', 'head_green', 'head_orange'];

    // Choose a random color from the array and return it
    return Phaser.ArrayUtils.getRandomItem(colors);
},

randomBG: function () {
    // Define an array of available background textures
    var backgrounds = [
        'bg_darkgray_grid',
        'bg_gray',
        'bg_darkblue',
        'bg_darkbrown_zigzag',
        'bg_darkred_grid',
        'bg_lightblue_mesh',
        'bg_purple_pixels',
        'bg_darkgreen_oldcanvas'
    ];

    // Choose a random background texture from the array and return it
    return Phaser.ArrayUtils.getRandomItem(backgrounds);
},

increaseLength: function () {
    // Default position for a new snake head
    var x = 216;
    var y = 216;

    // Check if there are existing snake segments
    if (this.player.length !== 0) {
        // Calculate the position based on the last snake head
        var lastHead = this.player[this.player.length - 1];
        x = lastHead.x + 18;
        y = lastHead.y + 18;
    }

    // Create a new snake head sprite at the calculated position
    var snakeHead = game.add.sprite(x, y, this.color);

    // Enable arcade physics for the new snake head
    game.physics.arcade.enable(snakeHead);

    // Add the new snake head to the player's array
    this.player.push(snakeHead);
},
getTimeStamp: function () {
    // Get the current timestamp using the Date object
    return new Date().getTime();
},

updateScore: function () {
    // Update the displayed score text with the current score value
    this.scoreText.setText('SCORE: ' + score);
},

saveScore: function () {
    // Check if the browser supports localStorage
    if (typeof (Storage) !== 'undefined') {
        // Access the localStorage object
        var myStorage = localStorage;

        // Check if the 'score' key exists in localStorage; if not, initialize it to 0
        if (!myStorage.score) {
            myStorage.setItem('score', 0);
        }

        // Update the 'score' key in localStorage with the current score value
        myStorage.score = score;
    }
},

showScore: function () {
    // Define the style for displaying the score
    var endStyle = {
        fontSize: '15pt',
        fill: '#000000',
        boundsAlignV: 'center',
        stroke: '#303030',
        strokeThickness: 1
    };

    // Create a text element to display the score on the screen
    this.scoreTxt = game.add.text(160, 300, '', endStyle);

    // Access localStorage to retrieve the saved score
    myStorage = localStorage;

    // Update the score text with the player's score from localStorage
    this.scoreTxt.setText('Your score: ' + myStorage.score);
},

checkOutOfBoundary: function () {
    // Check if the snake's head is out of the game boundary
    if (
        this.player[0].x > game.world.width - (this.player[0].width - 1) ||
        this.player[0].x < 0 - 10 ||
        this.player[0].y > game.world.height - (this.player[0].height - 1) ||
        this.player[0].y < 0 - 10
    ) {
        return true;
    }

    // Return false if the snake's head is within the boundary
    return false;
},
//
//
checkCollisionSelf: function () {
    // Loop through the player's segments, starting from the second segment
    for (var i = 1; i < this.player.length; i++) {
        // Check if the snake's head collides with any of its body segments
        if (this.player[0].body.hitTest(this.player[i].x, this.player[i].y)) {
            // Collision detected; return true
            return true;
        }
    }
    // No collision detected; return false
    return false;
},

changeDirect: function () {
    // Update the direction of the snake's head based on the current direction
    switch (this.currentDirection) {
        case this.Direction.UP:
            this.player[0].y -= this.speed; // Move the head upwards
            break;
        case this.Direction.DOWN:
            this.player[0].y += this.speed; // Move the head downwards
            break;
        case this.Direction.LEFT:
            this.player[0].x -= this.speed; // Move the head to the left
            break;
        case this.Direction.RIGHT:
            this.player[0].x += this.speed; // Move the head to the right
            break;
    }
}

touch: function () {
    // Get the current touch coordinates
    var touch = [game.input.x, game.input.y];

    // Initialize variables
    var lastPassed = [0, 0];
    var tiles = [];
    var w = game.width;
    var h = game.height;

    // Create a 3x3 grid of tiles
    for (var i = 0; i < 3; i++) {
        tiles[i] = [];
    }

    // Populate the tiles with coordinates
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var tmp_x = Math.round(w / 3) + j * Math.round(w / 3);
            var tmp_y = Math.round(h / 3) + i * Math.round(h / 3);
            tiles[i][j] = [tmp_x, tmp_y];
        }
    }

    // Determine the position of the touch within the grid
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (i === 0) {
                if (touch[0] < tiles[i][j][0]) {
                    lastPassed[0]++;
                }
            } else {
                if (touch[0] > tiles[i - 1][j][0] && touch[0] < tiles[i][j][0]) {
                    lastPassed[0]++;
                }
            }
            if (j === 0) {
                if (touch[1] < tiles[i][j][1]) {
                    lastPassed[1]++;
                }
            } else {
                if (touch[1] > tiles[i][j - 1][1] && touch[1] < tiles[i][j][1]) {
                    lastPassed[1]++;
                }
            }
        }
    }

    // Determine the direction based on the touch position
    if (lastPassed[0] === 2 && lastPassed[1] === 3) { // Upper-middle quadrant
        if (this.currentDirection !== this.Direction.DOWN)
            this.currentDirection = this.Direction.UP;
    } else if (lastPassed[0] === 3 && lastPassed[1] === 2) { // Middle-right quadrant
        if (this.currentDirection !== this.Direction.RIGHT)
            this.currentDirection = this.Direction.LEFT;
    } else if (lastPassed[0] === 1 && lastPassed[1] === 2) { // Middle-left quadrant
        if (this.currentDirection !== this.Direction.LEFT)
            this.currentDirection = this.Direction.RIGHT;
    } else if (lastPassed[0] === 2 && lastPassed[1] === 1) { // Lower-middle quadrant
        if (this.currentDirection !== this.Direction.UP)
            this.currentDirection = this.Direction.DOWN;
    }

    // No action for other positions (corners and edges)
},
update: function () {
    // Check keyboard input and update the snake's direction
    if (this.keyUP.isDown || this.keyW.isDown) {
        if (this.currentDirection !== this.Direction.DOWN)
            this.currentDirection = this.Direction.UP;
    }
    if (this.keyLEFT.isDown || this.keyA.isDown) {
        if (this.currentDirection !== this.Direction.RIGHT)
            this.currentDirection = this.Direction.LEFT;
    }
    if (this.keyRIGHT.isDown || this.keyD.isDown) {
        if (this.currentDirection !== this.Direction.LEFT) {
            this.currentDirection = this.Direction.RIGHT;
        }
    }
    if (this.keyDOWN.isDown || this.keyS.isDown) {
        if (this.currentDirection !== this.Direction.UP)
            this.currentDirection = this.Direction.DOWN;
    }

    // Limit update speed to avoid rapid updates
    if ((this.getTimeStamp() - this.lastUpdate) <= this.updateSpeed) {
        return;
    }

    // Check if the snake collides with itself
    if (this.checkCollisionSelf()) {
        game.state.start("end");
        return;
    }

    // Check if the snake eats the apple
    if (((this.player[0].x + (this.player[0].width / 2)) > this.apple.x) && (this.player[0].x < (this.apple.x + this.apple.width / 2))) {
        if (((this.player[0].y + (this.player[0].height / 2)) > this.apple.y) && (this.player[0].y < (this.apple.y + this.apple.height / 2))) {
            // Destroy the eaten apple, play sound, and increase length
            this.apple.destroy();
            this.apple_sound.play();
            this.increaseLength();

            // Generate a new random position for the apple
            var x, y;
            do {
                x = Math.floor((Math.random() * 450) + 18) % 18 * 18;
                y = Math.floor((Math.random() * 450) + 54) % 18 * 18;

                // Check if the new position overlaps with the snake
                var overlap = false;
                for (var i = 0; i < this.player.length; i++) {
                    if (this.player[i].body.hitTest(x, y)) {
                        overlap = true;
                        break;
                    }
                }
            } while (overlap);

            this.apple = game.add.sprite(x, y, 'apple');
            score += 5;

            // Increase the snake's speed every 50 points
            if (score % 50 === 0) {
                if (this.updateSpeed >= 10)
                    this.updateSpeed -= 10;
            }
            this.updateScore();
        }
    }

    // Update the timestamp
    this.lastUpdate = this.getTimeStamp();

    // Move the snake segments
    var oldX, oldY;
    for (var i = 0; i < this.player.length; i++) {
        var x = this.player[i].x;
        var y = this.player[i].y;
        if (i !== 0) {
            this.player[i].x = oldX;
            this.player[i].y = oldY;
        }
        oldX = x;
        oldY = y;
    }

    // Change the snake's direction
    this.changeDirect();

    // Check if the snake goes out of bounds
    if (this.checkOutOfBoundry()) {
        game.state.start('end');
        return;
    }
}

var endGame = {
    preload: function () {
        // Preload game over images and sound
        game.load.spritesheet('gameover', 'img/gameover.png', 400, 200);
        game.load.spritesheet('gameover2', 'img/gameover_white.png', 400, 200);
    },
    create: function () {
        // Set the background color
        game.stage.backgroundColor = '#555555';

        // Create and play the game over sound
        this.gameover_sound = game.add.audio('gameover');
        this.gameover_sound.play();

        // Create the initial game over button
        this.but3 = game.add.button(game.world.centerX - (game.cache.getImage('gameover').width / 2),
            game.world.centerY - (game.cache.getImage('gameover').height / 2),
            'gameover',
            this.endGame,
            this);

        // Add an event handler for button click
        this.but3.events.onInputDown.add(this.endDown, this);

        // Create and initialize the click sound
        this.but3 = game.add.audio('click');

        // Save the score and show it on the screen
        mainState.saveScore();
        mainState.showScore();
    },
    endDown: function () {
        // Create a new game over button with different image
        this.but4 = game.add.button(game.world.centerX - (game.cache.getImage('gameover2').width / 2),
            game.world.centerY - (game.cache.getImage('gameover2').height / 2),
            'gameover2',
            this.endGame,
            this);

        // Change the text color of the score display
        mainState.scoreTxt.fill = '#ffffff';
    },
    endGame: function () {
        // Reset the score and return to the main game state
        score = 0;
        game.state.start('main');

        // Play the click sound
        this.but3.play();
    }
};

// Create a new Phaser game instance
var game = new Phaser.Game(450, 450, Phaser.AUTO);

// Add game states
game.state.add('state', startGame, true);
game.state.add('main', mainState, false);
game.state.add('end', endGame, false);
