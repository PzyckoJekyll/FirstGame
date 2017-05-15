var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
var field;
var backgroundv;
var ships;
var cursors;
var bullets;
var bulletsTime = 0;
var fireButton;
var enemies;
var score = 0;
var scoreText;
var winText;



var GameState = {
  
  preload: function(){
      game.load.image('stars','asset/images/background.png');
      game.load.image('spaceship','asset/images/spaceship.png');
      game.load.image('bullet','asset/images/laser.png');
      game.load.image('enemy','asset/images/enemy.png');
      game.load.bitmapFont('desyrel', 'asset/fonts/bitmapFonts/font.png', 'asset/fonts/bitmapFonts/font.xml');
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
       
      enemies = game.add.group();
      enemies.enableBody = true;
      enemies.physicsBodyType = Phaser.Physics.ARCADE;

      createEnemies();

      //scoreText = game.add.bitmapText(game.width-250, 50, 'desyrel', 'Score:', 32);
      winText= game.add.bitmapText(200, 100, 'desyrel', 'You Win!', 64);
      winText.visible=false;
      
  },

  update: function(){

      game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);

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

      //scoreText.text = 'Score: ' + score;

     if(score == 4000){
         //scoreText.visible=false;
         winText.visible=true;
        
     }

      screenWrap(ships) ;
      
  } 

};

function fireBullet(){
    if (game.time.now > bulletsTime){
        bullet = bullets.getFirstExists(false);
        if(bullet){
            bullet.reset(ships.x+70,ships.y);
            bullet.body.velocity.y = -400;
            bulletsTime = game.time.now + 150;
        }

    }
};

function createEnemies(){
    for(var y = 0; y < 4; y++){
         for(var x = 0; x < 10; x++){
            var enemy = enemies.create(x*48, y*50,'enemy');
            enemy.anchor.setTo(0.5, 0.5);
        }
    }

    enemies.x = 100;
    enemies.x = 50;

    var tween = game.add.tween(enemies).to({x:200},2000,Phaser.Easing.Linear.None, true,0,1000,true);
    tween.onRepeat.add(descend,this);
};

function descend(){
    enemies.y +=10;
}

function collisionHandler(bullet,enemy){
    bullet.kill();
    enemy.kill();

    score += 100;
};

function screenWrap(ships) {

  if (ships.x < 0) {
    ships.x = game.width;
  }
  else if (ships.x > game.width) {
    ships.x = 0;
  }

  if (ships.y < 0) {
    ships.y = game.height;
  }
  else if (ships.y > game.height) {
    ships.y = 0;
  }

};

game.state.add('GameState',GameState);
game.state.start('GameState');

