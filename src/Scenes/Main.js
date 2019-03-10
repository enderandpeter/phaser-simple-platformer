import Phaser from 'phaser';

export default class Main extends Phaser.Scene{
    map = null
    groundLayer = null
    player = null
    cursors = null
    coinLayer = null
    score = 0
    text = null
    constructor(){
        super("Main")
    }
    preload(){
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        // tiles in spritesheet
        this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
        // simple coin image
        this.load.image('coin', 'assets/coinGold.png');
        // player animations
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
    }
    create(){
        // load the map
        this.map = this.make.tilemap({key: 'map'});

        // tiles for the ground layer
        const groundTiles = this.map.addTilesetImage('tiles');
        // create the ground layer
        this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);
        // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);

        // coin image used as tileset
        const coinTiles = this.map.addTilesetImage('coin');
        // add coins as tiles
        this.coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0);

        // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        // create the player sprite
        this.player = this.physics.add.sprite(200, 200, 'player');
        this.player.setBounce(0.2); // our player will bounce from items
        this.player.setCollideWorldBounds(true); // don't go out of the map

        // small fix to our player images, we resize the physics body object slightly
        this.player.body.setSize(this.player.width, this.player.height - 8);

        // The player collides with the ground
        this.physics.add.collider(this.groundLayer, this.player);

        this.coinLayer.setTileIndexCallback(17, this.collectCoin.bind(this)); // the coin id is 17
        // when the player overlaps with a tile with index 17, collectCoin will be called
        // Set the player collider before calling this, or it will unset the collider
        this.physics.add.overlap(this.player, this.coinLayer);

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);

        // set background color, so the sky is not black
        this.cameras.main.setBackgroundColor('#ccccff');

        // User Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', { prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        // idle with only one frame, so repeat is not needed
        this.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'p1_stand'}],
            frameRate: 10,
        });

        this.text = this.add.text(20, 570, '0', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.text.setScrollFactor(0);
    }
    update(){
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-200); // move left
            this.player.anims.play('walk', true); // play walk animation
            this.player.flipX = true; // flip the sprite to the left
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(200); // move right
            this.player.anims.play('walk', true); // play walk animation
            this.player.flipX = false; // use the original sprite looking to the right
        } else {
            this.player.body.setVelocityX(0);
            this.player.anims.play('idle', true);
        }

        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor())
        {
            this.player.body.setVelocityY(-500); // jump up
        }
    }
    collectCoin(sprite, tile) {
        this.coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
        this.score ++; // increment the score
        this.text.setText(this.score); // set the text to show the current score
        return false;
    }
}