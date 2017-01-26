const gameState = {create: create, update: update}

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
  let stateText //text for wave transition
  let gaveOver //text for gameover state
  let wave = 1 //curent skeleton wave

  function create() {
    //creates keyboard input
    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    //loads background
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

    //adds ground object
    ground = game.add.tileSprite(0, HEIGHT - 150, WIDTH*3, 450, 'ground')
    ground.scale.setTo(0.4, 0.4) //scales to fit game width
    ground.tint = 0x93ecbf
    game.physics.arcade.enable(ground)
    ground.body.immovable = true;

    loadPlayer()

    loadEnemies()

    //adds gameover text
    gameOver = game.add.group()
    const graphics = game.add.graphics(0, 0)
    gameOver.add(graphics)
    graphics.beginFill(0xffffff, 0.5)
    graphics.drawRoundedRect(250, 180, 300, 60, 20)
    let gameOverText = game.add.text(260, 185, 'GAMEOVER', { font: '48px Arial', fill: '#002d10', fontWeight: 'bold'})
    // let restartText = game.add.text(260, 250, 'Play again?', { font: '28px Arial', fill: '#fff'})
    gameOver.add(gameOverText)
    // gameOver.add(restartText)
    gameOver.visible = false

    //adds current wave display
    scoreText = game.add.text(10, 10, 'wave: '+wave, { font: '32px Arial', fill: '#fff' })
    stateText = game.add.text(200, game.world.centerY - 200,' ', { font: '48px Arial', fill: '#fff' })
    //adds wave transition display
    stateText.text="WAVE COMPLETE \n Start next wave?"
    stateText.visible = false


  }

  function loadPlayer() {
    //add player
    player = game.add.sprite(WIDTH*0.5, HEIGHT*0.5, 'hero')

    player.scale.setTo(3, 3)
    game.physics.arcade.enable(player)
    player.anchor.set(0.5, 0.5)
    player.body.setSize(8 , 53, 25, 0) //adjusts collision bounds
    player.body.bounce.y = 0.2
    player.body.gravity.y = 1000
    player.alive = true
    player.attacking = false

    //sets player animations
    player.animations.add('idle', [0, 1, 2, 3], 5, true)
    player.animations.add('walk', [16, 17, 18, 19, 20, 21, 22, 23], 10, true)
    player.animations.add('punch', [151, 152, 146, 150], 10, false)
    player.animations.add('kick', [162, 163, 164, 165], 10, false)
    player.animations.add('dead', [64, 65, 66, 67, 68, 69, 70], 5, false)
    // player.animations.add('jump', [32, 33, 34, 35, 36, 37, 38, 39], 5, false)
  }



  function loadEnemies() {
    enemies = game.add.group()
    sendWave(5, 3000)
  }

  function update() {
    //checks if player and enemies are touching the ground
    hitGround = game.physics.arcade.collide(player, ground)
    game.physics.arcade.collide(enemies, ground)
    game.physics.arcade.collide(player, enemies, attack, null, this) //checks if skeleton attacking player
    checkHit() //checks if player attacking skeleton
    move() //moves player
    moveEnemies()
    //triggers wave transition
    if(currentEnemies === 0 && !paused){
      pauseState()
    }
  }

  //paused state in between enemy waves
  function pauseState() {
    paused = true
    stateText.visible = true
    //ends transition and sends next wave
    game.input.onTap.addOnce(function(){
      stateText.visible = false
      wave++
      sendWave(wave*5, 2000-(wave*100))
      scoreText.text = "wave: "+wave
      paused = false
    }, this)
  }

  //checks if player attacking enemy
  function  checkHit() {
    enemies.forEach(function (enemy){
      if(enemy.body.x > player.body.x - 120 && enemy.body.x < player.body.x + 50) {
        if(player.attacking && enemy.alive){
          enemy.alive = false
          enemy.animations.play('dead')
          currentEnemies--
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
          if(cursors.down.isDown) {
            player.attacking = true
            player.animations.play('kick')//right low kick
          }

          else{
            player.attacking = true
            player.animations.play('punch')//right jab
          }
        }

        else {
          scrollBackground('right')
          player.animations.play('walk') //walk right
        }
      }

      else if(cursors.left.isDown) {
        player.scale.x = -3
        if(spacebar.isDown) {
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

        else {
          scrollBackground('left')
          player.animations.play('walk') //walk left
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

  //checks if enemy attacking player
  function attack(player, enemy) {
    if(!player.attacking && enemy.alive) {
      if(!player.dead) { //stops death looping
        enemy.animations.play('attack')
        player.animations.play('dead')
        player.dead = true
        gameOver.visible = true
      }
    }
  }

  // function gameOver() {
  //   setInterval(function() {
  //     //gameOver
  //
  //     console.log('game over')
  //     //resets game
  //     game.input.onTap.addOnce(function(){
  //       wave = 1
  //       game.input.destroy
  //       gameOver.visible = false
  //       game.state.restart(true, false)
  //     },this)
  //   },2000)
  // }

  function moveEnemies() {
    enemies.forEach(function (enemy) {
      if(enemy.facingLeft) {enemy.body.x -= wave*0.3}
      else {enemy.body.x += wave*0.3}
    })
  }

  //sends new skeleton enemy
  function newEnemy (direction) {
    let enemy = game.add.sprite(0, HEIGHT-206, 'skeleton')
    game.physics.arcade.enable(enemy) //enables collision physics

    if(direction === 1)  { //enemy drops on right side of screen
       enemy.scale.setTo(-2, 2)
       enemy.x = 800
       enemy.facingLeft = true //stores where the enemy begins
     }
     else { //enemy drops on left side of screen
       enemy.scale.setTo(2, 2)
     }

    enemy.dead = false
    enemy.anchor.set(0.5)
    enemy.body.setSize(50, 80) //adjusts collision bounds

    enemy.animations.add('walk', [8, 9, 10, 11], 3+(wave*1.7), true)
    enemy.animations.add('attack', [17, 18, 19, 16], 5, false)
    enemy.animations.add('dead', [24, 25, 26, 27, 28, 29, 30], 5, false)
    .killOnComplete = true //removes enemy once dead
    enemy.animations.play('walk')
    //makes enemy resume walking when attack is complete
    enemy.events.onAnimationComplete = new Phaser.Signal()
    enemy.events.onAnimationComplete.add(function() {enemy.animations.play('walk')})

    enemies.add(enemy)
  }

  function scrollBackground (direction) {
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

//sends new enemy wave
function sendWave(size, delay) {
  currentEnemies = size
  let count = 1
  let id = setInterval(function() {
    if(count === size) {clearInterval(id)} //stops dropping enemys when wave size is reached
    let direction = Math.round(Math.random()) //decides where to drop new enemy
    newEnemy(direction)
    count++
  }, delay)
}
