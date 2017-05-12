var game = new Phaser.Game(640, 360, Phaser.AUTO);

var GameState = {
  preload: function(){
      this.load.image('background','asset/images/background.jpg');
      this.load.image('ken','asset/images/Kenshiro.png');
      this.load.image('raul','asset/images/Raul.png');
  },
  create: function(){
      this.background = this.game.add.sprite(0,0,'background');
      this.ken = this.game.add.sprite(this.world.centerX,this.world.centerY,'ken');
      this.ken.ancor.setTo(0.5,0.5);
  },
  update: function(){
      
  } 
};

game.state.add('GameState',GameState);
game.state.start('GameState');
