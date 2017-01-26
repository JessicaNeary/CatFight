const bootState = {

  create: function() {
    const loadBackground = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg3')
    loadBackground.scale.setTo(4, 4)
    const graphics = game.add.graphics(0, 0)
    graphics.beginFill(0xffffff, 0.5)
    graphics.drawRoundedRect(200, 50, 400, 400, 20)
    game.add.text(300, 60, 'CAT FIGHT', { font: '38px Arial', fill: '#002d10', fontWeight: 'bold'})
    game.add.text(230, 130, "One cat's last stand against \n       the skeleton hoard", { font: '28px Arial', fill: '#002d10'})
    game.add.text(210, 260, 'CONTROLS', { font: '30px Arial', fill: '#002d10'})
    game.add.text(210, 300, '- Move using the arrow keys', { font: '20px Arial', fill: '#002d10'})
    game.add.text(210, 330, '- Punch by holding the space bar and \nusing the left or right arrow key', { font: '20px Arial', fill: '#002d10'})
    game.add.text(210, 390, '- Kick by holding the space bar and the\ndown key while pressing the arrow keys', { font: '20px Arial', fill: '#002d10'})
    game.add.text(280, 480, 'PRESS SPACE TO CONTINUE', { font: '16px Arial', fill: '#fff'})

    const spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    spacebar.onDown.addOnce(() => game.state.start('game'))
  }

}
