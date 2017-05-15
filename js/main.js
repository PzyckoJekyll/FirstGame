var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
var field;
var backgroundv;
var ships;
var cursors;
var bullets;
var bulletsTime=0;
var fireButton;
var test;

var GameState = {
  preload: function(){
      game.load.image('stars','asset/images/background.png');
      game.load.image('spaceship','asset/images/spaceship.png');
      game.load.image('bullet','asset/images/laser.png');
      
  },
  create: function(){
      field = game.add.tileSprite(0,0,800,600,'stars');    
      backgroundv=2;
      ships = game.add.sprite(game.world.centerX ,game.world.centerY + 200 ,'spaceship');
      game.physics.enable(ships,Phaser.Physics.ARCADE);
      cursors = game.input.keyboard.createCursorKeys();
      
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.physicsBodyType = Phaser.Physics.ARCADE;
      bullets.createMultiple(30,'bullet');
      bullets.setAll('anchor.x',0.5);
      bullets.setAll('anchor.y',1);
      bullets.setAll('outOfBoundsKill',true);
      bullets.setAll('checkWorldBounds', true);

      fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);



  },
  update: function(){
      field.tilePosition.y +=backgroundv;
      ships.body.velocity.x =0;
      if(cursors.left.isDown){
          ships.body.velocity.x = -350;
      }

      if(cursors.right.isDown){
          ships.body.velocity.x = 350;
      }

      if(fireButton.isDown){
          fireBullet();
      }
      
  } 
};

function fireBullet(){
    if (game.time.now > bulletsTime){
        bullet = bullets.getFirstExists(false);
        if(bullet){
            bullet.reset(ships.x+70,ships.y);
            bullet.body.velocity.y = -400;
            bulletsTime = game.time.now + 200;
        }

    }
};

game.state.add('GameState',GameState);
game.state.start('GameState');

