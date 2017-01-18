window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

const WIDTH = 800
const HEIGHT = 600

let player
let enemies
let ground
let hitGround //checks whether player is touching the ground
let cursors //stores keyboard input
let spacebar

let bg0
let bg1
let bg2
let bg3

const game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('bg3', 'assets/3_bg.png')
  game.load.image('bg2', 'assets/2_far-buildings.png')
  game.load.image('bg1', 'assets/1_buildings.png')
  game.load.image('bg0', 'assets/0_foreground.png')
  game.load.image('ground', 'assets/ground.jpg')
  game.load.spritesheet('hero', 'assets/cat_fighter.png', 64, 64)

}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  cursors = game.input.keyboard.createCursorKeys();
  spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

  loadPlayer()
	game.camera.focusOnXY(player.x, player.y) //locks camera onto player

  loadEnemies()

  //add background
	bg3 = game.add.tileSprite(0, 0, 160, 127, 'bg3')
	bg2 = game.add.tileSprite(0, 0, 160, 127, 'bg2')
	bg1 = game.add.tileSprite(0, 0, 160, 127, 'bg1')
	bg0 = game.add.tileSprite(0, 0, 160, 127, 'bg0')

  //add ground
  // platform = game.add.group()
  ground = game.add.tileSprite(0, HEIGHT - 150, WIDTH, 150, 'ground')
	ground.enableBody = true; //enables physics
  // ground.scale.setTo(0.4, 0.4) //scales to fit game width
  // ground.body.immovable = true;

}

function update() {
  hitGround = game.physics.arcade.collide(player, ground)
  movePlayer()
	moveBg()
}

function movePlayer() {
  //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.right.isDown) {
      player.scale.x = 3

      if(spacebar.isDown) {
        player.body.velocity.x = 100
        player.animations.play('walk') //walk right
      }

      else {
        if(cursors.down.isDown) {
          player.animations.play('kick')//right low kick
        }
        else{
          player.animations.play('punch')//right jab
        }
      }
    }


    else if(cursors.left.isDown) {
      player.scale.x = -3

      if(spacebar.isDown) {
        player.body.velocity.x = -15
        player.animations.play('walk') //walk left
      }

      else {
        //left uppercut
        if(cursors.down.isDown) {
          player.animations.play('kick') //left kick
        }
        else {
          player.animations.play('punch') //left jab
        }
      }
    }

    else if (cursors.up.isDown && player.body.touching.down && hitGround) {
      //  player.animations.play('jump')
       player.body.velocity.y = -350
    }
    else {
      player.animations.play('idle')
    }
}

function moveBg() {
	ground.tilePosition.x -= 0.5
	bg0.tilePosition.x -= 0.5
	bg1.tilePosition.x -= 0.3
	bg2.tilePosition.x -= 0.1
}

function loadPlayer() {
  //add player
  player = game.add.sprite(WIDTH*0.5, HEIGHT*0.5, 'hero')
  player.frame = 0

  player.scale.setTo(3, 3)
  game.physics.arcade.enable(player)
  player.anchor.set(0.5)
  player.body.setSize(41, 53) //adjusts bounds
  player.body.bounce.y = 0.2
  player.body.gravity.y = 1000
  // player.body.collideWorldBounds = true;

  //sets player animations
  player.animations.add('idle', [0, 1, 2, 3], 5, true)
  player.animations.add('walk', [16, 17, 18, 19, 20, 21, 22, 23], 10, true)
  // player.animations.add('punch', [98, 99, 100, 101], 10, false)
  player.animations.add('punch', [151, 152, 146, 150], 10, false)
  player.animations.add('kick', [162, 163, 164, 165], 10, false)
  // player.animations.add('jump', [32, 33, 34, 35, 36, 37, 38, 39], 5, false)
}

function loadEnemies() {
  enemies = game.add.group()
}
