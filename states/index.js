const WIDTH = 800
const HEIGHT = 600

const game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create});

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
  game.scale.windowConstraints.bottom = "visual"
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.state.add('boot', bootState)
  game.state.add('game', gameState)

  game.state.start('boot')
}
