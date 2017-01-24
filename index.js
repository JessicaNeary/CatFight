window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')


const WIDTH = 800
const HEIGHT = 600

//game variables
let player
let enemies //group for all enemies
let ground
let hitGround //checks whether player is touching the ground
let cursors //stores keyboard input
let spacebar
let background

//state variables
let paused = false
let currentEnemies //stores number of enemies current alive
let stateText
let gaveOverText
let wave = 1


const game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('ground', 'assets/metal_thing_3.jpg', 1908, 484)
  game.load.spritesheet('hero', 'assets/cat_fighter.png', 64, 64)
  game.load.image('bg0', 'assets/0_foreground.png', 272, 104)
  game.load.image('bg1', 'assets/1_buildings.png', 272, 150)
  game.load.image('bg2', 'assets/2_far-buildings.png', 213, 142)
  game.load.image('bg3', 'assets/3_bg.png', 272, 160)
  game.load.spritesheet('skeleton', 'assets/skeleton.png', 64, 64)
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  cursors = game.input.keyboard.createCursorKeys();
  spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

  //add background
  const bg3 = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg3')
  const bg2 = game.add.tileSprite(50, 0, WIDTH, HEIGHT, 'bg2')
  const bg1 = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg1')
  const bg0 = game.add.tileSprite(0, 50, WIDTH, HEIGHT, 'bg0')
  background = game.add.group()
  background.add(bg3)
  background.add(bg2)
  background.add(bg1)
  background.add(bg0)
  background.setAll('tileScale.x', 4)
  background.setAll('tileScale.y', 4)


  //add ground
  ground = game.add.tileSprite(0, HEIGHT - 150, WIDTH*3, 450, 'ground')
  ground.scale.setTo(0.4, 0.4) //scales to fit game width
  ground.tint = 0x93ecbf
  game.physics.arcade.enable(ground)
  ground.body.immovable = true;


  loadPlayer()
  // game.debug.body(player, 'pink')

  loadEnemies()
  // enemies.forEach(function (enemy){
  //
  // })



  scoreText = game.add.text(10, 10, 'wave: '+wave, { font: '32px Arial', fill: '#fff' })
  stateText = game.add.text(game.world.centerX - 100, game.world.centerY - 200,' ', { font: '48px Arial', fill: '#fff' })
  gameOverText = game.add.text(game.world.centerX - 100, game.world.centerY - 200,'GAME OVER \n Click to restart', { font: '48px Arial', fill: '#fff' })
  gameOverText.visible = false
  stateText.text="WAVE COMPLETE \n Start next wave?"
  stateText.visible = false
}

function pauseState() {
  paused = true
  console.log('wave complete')
  stateText.visible = true
  game.input.onTap.addOnce(function(){
    stateText.visible = false
    wave++
    sendWave(wave*5, 2000)
    scoreText.text = "wave: "+wave
    paused = false
  }, this)
}

function gameOver() {
  gameOverText.visible = true
  // wave = 1
  // game.input.onTap.addOnce(function() {
  //   enemies.removeAll()
  //   player.reset(WIDTH*0.5, HEIGHT*0.5)
  //   player.animations.play('idle')
  //   loadEnemies()
  // })
}

function update() {
  hitGround = game.physics.arcade.collide(player, ground)
  game.physics.arcade.collide(enemies, ground)
  game.physics.arcade.collide(player, enemies, attack, null, this)
  checkHit()
  move()
  moveEnemies()
  if(currentEnemies === 0 && !paused){
    pauseState()
  }
}

function  checkHit() {
  enemies.forEach(function (enemy){
    if(enemy.body.x > player.body.x - 120 && enemy.body.x < player.body.x + 50) {
      if(player.attacking && enemy.alive){
        enemy.alive = false
        enemy.animations.play('dead')
        currentEnemies--
        console.log(currentEnemies)
      }
    }
  })
}

function move() {
  //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.attacking = false
    if(player.dead) {}
    else if (cursors.right.isDown) {
      player.scale.x = 3

      if(spacebar.isDown) {
        scrollBackground('right')
        player.animations.play('walk') //walk right
      }

      else {
        if(cursors.down.isDown) {
          player.attacking = true
          player.animations.play('kick')//right low kick
        }
        else{
          player.attacking = true
          player.animations.play('punch')//right jab
        }
      }
    }

    else if(cursors.left.isDown) {
      player.scale.x = -3

      if(spacebar.isDown) {
        scrollBackground('left')
        player.animations.play('walk') //walk left
      }

      else {
        //left uppercut
        if(cursors.down.isDown) {
          player.attacking = true
          player.animations.play('kick') //left kick
        }
        else {
          player.attacking = true
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


function attack(player, enemy) {
  if(!player.attacking && enemy.alive) {
    if(!player.dead) { //stops death looping
      enemy.animations.play('attack')
      player.animations.play('dead')
    }
    player.dead = true
    gameOver()
  }
}

function moveEnemies() {
  enemies.forEach(function (enemy) {
    if(enemy.facingLeft) {enemy.body.x -= wave*0.3}
    else {enemy.body.x += wave*0.3}
  })
}

function loadPlayer() {
  //add player
  player = game.add.sprite(WIDTH*0.5, HEIGHT*0.5, 'hero')

  player.scale.setTo(3, 3)
  game.physics.arcade.enable(player)
  player.anchor.set(0.5, 0.5)
  player.body.setSize(8 , 53, 25, 0) //adjusts bounds
  player.body.bounce.y = 0.2
  player.body.gravity.y = 1000
  player.alive = true
  player.attacking = false
  // player.body.collideWorldBounds = true;

  //sets player animations
  player.animations.add('idle', [0, 1, 2, 3], 5, true)
  player.animations.add('walk', [16, 17, 18, 19, 20, 21, 22, 23], 10, true)
  // player.animations.add('punch', [98, 99, 100, 101], 10, false)
  player.animations.add('punch', [151, 152, 146, 150], 10, false)
  player.animations.add('kick', [162, 163, 164, 165], 10, false)
  player.animations.add('dead', [64, 65, 66, 67, 68, 69, 70], 5, false)
  // player.animations.add('jump', [32, 33, 34, 35, 36, 37, 38, 39], 5, false)
}



function loadEnemies() {
  enemies = game.add.group()
  // enemies.createnewEnemy()
  sendWave(1, 3000)
  // game.physics.arcade.enable(enemies)
}

function sendWave (size, delay) {
  currentEnemies = size
  let count = 1
  let id = setInterval(function() {
    if(count === size) {clearInterval(id)}
    let direction = Math.round(Math.random())
    console.log(direction)
    newEnemy(direction)
    count++
  }, delay)
}

function newEnemy (direction) {
  let enemy = game.add.sprite(0, HEIGHT-206, 'skeleton')
  game.physics.arcade.enable(enemy)
  if(direction === 1)  {
    //  enemy = game.add.sprite(800, 150, 'skeleton')
     enemy.scale.setTo(-2, 2)
     enemy.x = 800
     enemy.facingLeft = true //stores where the enemy begins
   }
   else {
    //  enemy = game.add.sprite(0, 150, 'skeleton')
     enemy.scale.setTo(2, 2)
   }
  enemy.frame = 0
  enemy.dead = false
  enemy.anchor.set(0.5)

  enemy.body.setSize(50, 80) //adjusts bounds
  enemy.animations.add('walk', [8, 9, 10, 11], 3+(wave), true)
  enemy.animations.add('attack', [17, 18, 19, 16], 5, false)
  enemy.animations.add('dead', [24, 25, 26, 27, 28, 29, 30], 5, false)
  .killOnComplete = true
  enemy.animations.play('walk')
  //makes enemy resume walking when attack is complete
  enemy.events.onAnimationComplete = new Phaser.Signal()
  enemy.events.onAnimationComplete.add(function() {enemy.animations.play('walk')})
  // game.debug.body(enemy, 'red')
  enemies.add(enemy)
}


function scrollBackground (direction) {
  // background.set(bg0, 'tilePosition.x', 50, 1)
  let distance = 0.1
  background.forEach(function (bg) {
    if(direction === 'left') bg.tilePosition.x += distance
    else bg.tilePosition.x -= distance
    distance += 0.05
  })
  if(direction === 'left'){
    ground.tilePosition.x += 5
    enemies.setAll('body.x', 2, false, false, 1)
  }
  else{
    ground.tilePosition.x -= 5
    enemies.setAll('body.x', 2, false, false, 2)
  }
}
