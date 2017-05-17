var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
var field;
var backgroundv;
var ships;
var cursors;
var bullets;
var bulletsTime = 0;
var enemyBullets;
var enemyBulletsTime = 0;
var fireButton;
var enemies;
var enemy=null;
var score = 0;
var scoreText;
var scoreFont;
var winText;
var loseText;
var restartText;
var stillBallin = true;
var enemiesNumber = 39;

var livingEnemies = [];
var GameState = {
  
  preload: function(){
      game.load.image('stars','asset/images/background.png');
      game.load.image('spaceship','asset/images/spaceship.png');
      game.load.image('bullet','asset/images/laser.png');
      game.load.image('herobullet','asset/images/herolaser.png');
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
      bullets.createMultiple(30,'herobullet');
      bullets.setAll('anchor.x',0.5);
      bullets.setAll('anchor.y',1);
      bullets.setAll('outOfBoundsKill',true);
      bullets.setAll('checkWorldBounds', true);

      enemyBullets = game.add.group();
      enemyBullets.enableBody = true;
      enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
      enemyBullets.createMultiple(30,'bullet');
      enemyBullets.setAll('anchor.x',0.5);
      enemyBullets.setAll('anchor.y',1);
      enemyBullets.setAll('outOfBoundsKill',true);
      enemyBullets.setAll('checkWorldBounds', true);

      fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
       
      enemies = game.add.group();
      enemies.enableBody = true;
      enemies.physicsBodyType = Phaser.Physics.ARCADE;

      if(stillBallin){
        createEnemies();    
      }

    //   scoreText = game.add.bitmapText(game.width-250, 50, 'desyrel', 'Score:', 32);
    //   scoreText.visible=false;

      scoreText = "Score: 0";
      scoreFont = this.game.add.bitmapText(800, 600, 'desyrel', scoreText, 32);
      scoreFont.anchor.setTo(1, 1);   
      winText= game.add.bitmapText(game.world.centerX ,game.world.centerY-200 , 'desyrel', 'You Win!', 100);
      winText.anchor.setTo(0.5, 0.5);     
      winText.visible=false;
      loseText= game.add.bitmapText(game.world.centerX ,game.world.centerY-200  , 'desyrel', 'You Lose!', 100);
      loseText.anchor.setTo(0.5, 0.5);
      loseText.visible=false;
      restartText= game.add.bitmapText(game.world.centerX ,game.world.centerY , 'desyrel', 'Still Ballin\'?\n  click here', 60);
      restartText.anchor.setTo(0.5, 0.5);
      restartText.visible=false;

      restartText.inputEnabled = true;
      restartText.events.onInputDown.add(restart, this);
      
  },

  update: function(){

      game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);
      game.physics.arcade.overlap(ships,enemyBullets,enemyCollisionHandler,null,this);

      field.tilePosition.y +=backgroundv;
      ships.body.velocity.x =0;
      if(cursors.left.isDown){
          ships.body.velocity.x = -350;
      }

      if(cursors.right.isDown){
          ships.body.velocity.x = 350;
      }

      if(fireButton.isDown){
        if(stillBallin){
          fireBullet();
        }
      }

      
      //scoreText.text="Score" + score + " ";

     if(score == 4000){
         scoreText.visible=false;
         stillBallin=false;
         winText.visible=true;
         restartText.visible=true;
        
     }
     if(stillBallin){
        enemyFireBullet(enemies);
     }
     screenWrap(ships) ;
      
  } 

};

function fireBullet(){
    if (game.time.now > bulletsTime){
        bullet = bullets.getFirstExists(false);
        if(bullet){
            bullet.reset(ships.x+38,ships.y);
            bullet.body.velocity.y = -400;
            bulletsTime = game.time.now + 150;
        }

    }
};

function enemyFireBullet(enemies){
    if (game.time.now > enemyBulletsTime){
        //enemy= enemies.getChildAt(Math.floor(Math.random() * (enemiesNumber)) + 0);
        enemyBullet = enemyBullets.getFirstExists(false);

        livingEnemies.length=0;

        enemies.forEachAlive(function(enemy){

        // put every living enemy in an array
        livingEnemies.push(enemy);
        });

        if (enemyBullet && livingEnemies.length > 0)
        {
            if(Math.floor(Math.random() * (50))>48){
            var random=game.rnd.integerInRange(0,livingEnemies.length-1);

            // randomly select one of them
            var shooter=livingEnemies[random];

            // And fire the bullet from this enemy
            enemyBullet.reset(shooter.body.x+15, shooter.body.y+26);

            game.physics.arcade.moveToObject(enemyBullet,ships,120);
            enemyBulletsTime = game.time.now + 150;

     //     enemyBullet.reset(enemy.x+15,enemy.y);
     //     enemyBullet.body.velocity.y = 240;
     //     enemyBulletsTime = game.time.now + 150;
       

           }
            
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
    enemies.y = 50;
    
    if(stillBallin){
      
        enemy.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
        enemy.play('fly');
        enemy.body.moves = false;

        var tween = game.add.tween(enemies).to({x:200},2000,Phaser.Easing.Linear.None, true,0,1000,true);
        tween.onRepeat.add(descend,this);
    }
};

function descend(){
    enemies.y +=10;
};

function collisionHandler(bullet,enemy){
    bullet.kill();
    enemy.kill();
    enemies.remove(enemy);
    enemiesNumber-=1;
    score += 100;
    scoreText = "Score: " + score.toString();
    scoreFont.text = scoreText;
 
};

function enemyCollisionHandler(ships,enemyBullet){
    if(stillBallin){
      ships.kill();
      enemyBullet.kill();
      loseText.visible=true;
    }
   
    stillBallin=false;
    restartText.visible=true;

};

function screenWrap(ships) {

  if (ships.x < 0) {
    ships.x = 0;
  }
  else if (ships.x > game.width-139) {
    ships.x =  game.width-139;
  }

  if (ships.y < 0) {
    ships.y = game.height;
  }
  else if (ships.y > game.height) {
    ships.y = 0;
  }
  
};

function restart(){
   bulletsTime = 0;
   enemyBulletsTime = 0;
   score = 0;

   stillBallin = true;
   game.state.start('GameState');
}
game.state.add('GameState',GameState);
game.state.start('GameState');

