enchant();

// 画像をグローバル変数に定義
var CHARA_IMAGE = "./koukaton.png";
var MAP_IMAGE = "./map2.gif";
var TIMEUP_IMAGE = "./timeup.png";
var ICON_IMAGE = "./sime.png";
var END_IMAGE = "./end.png";
var EFFECT_IMAGE = "./effect0.png";
var BULLET_IMAGE = "./bullet.png";
var MAZAI_IMAGE = "./potion.png";
var TANI_IMAGE = "./tani.png";
var PAUSE_IMAGE = "./pause.png";

var SCREEN_WIDTH = $(window).width();
var SCREEN_HEIGHT = $(window).height();
var FPS = 35;
var BACKGROUND_WIDTH = 1630;
var BACKGROUND_HEIGHT = 320;
var BACKGROUND_IMAGE = "./background.png";

var flag = 1;

function gameLoad(SCREEN_WIDTH,SCREEN_HEIGHT) {
  core = new Core(SCREEN_WIDTH,SCREEN_HEIGHT);
  core.fps = FPS;

  // ゲームで使用する画像ファイルを指定する
  // ICON_IMAGEを指定してなかったために、爆弾が表示されなかった
  core.preload( CHARA_IMAGE, MAP_IMAGE, TIMEUP_IMAGE, ICON_IMAGE,END_IMAGE, BACKGROUND_IMAGE, EFFECT_IMAGE, BULLET_IMAGE ,MAZAI_IMAGE, TANI_IMAGE,PAUSE_IMAGE);
  // スコアを格納するプロパティを設定する
  core.score = 0;
  // 制限時間を管理するプロパティを設定する
  core.limitTime = 60;

  core.onload = function() {
    var bg = new Sprite(BACKGROUND_WIDTH, BACKGROUND_HEIGHT);
    bg.image = core.assets[BACKGROUND_IMAGE];
    bg.moveTo(0, 0);
    bg.addEventListener("enterframe", function() {
      bg.x -= 4;
      if (this.x <= -(BACKGROUND_WIDTH-SCREEN_WIDTH)){
        bg.moveTo(0, 0);
      }
    });
    core.rootScene.addChild( bg );

    // プレイヤーの画像を表示するスプライトを作成する
    player = new Sprite( 32, 32 );
    // プレイヤーの画像に「chara1.png」を設定する
    player.image = core.assets[CHARA_IMAGE];
    player.x = 120;            // x座標
    player.y = 160;            // y座標
    player.lifeVal = 80;      //playerの体力
    player.frame = 0;          // フレーム番号
    // ジャンプ時の高さ、または降下時のグラビティを設定するプロパティ
    player.vy = 0;
    player.vx = 0;
    // プレイヤーの「enterframe」イベントリスナ
    core.keybind(32, "s");
    player.addEventListener( 'enterframe', function( e ) {
      // アニメーション表示する処理
      this.frame = core.frame % 2 + 1;

      if(this.lifeVal === 0){
        this.removeEventListener('enterframe',arguments.callee);
      }

      if( core.input.up )
      {
        this.vy = -3;
      }
      if( core.input.down )
      {
        this.vy = 3;
      }
      if( core.input.right )
      {
        this.vx = 3;
      }
      if( core.input.left )
      {
        this.vx = -3;
      }

      if(this.x + this.vx > SCREEN_WIDTH - 32 || this.x + this.vx <= 0 ){
        this.vx = 0;
      }
      this.x += this.vx;
      if(this.y + this.vy > SCREEN_HEIGHT - 32 || this.y + this.vy <= 0){
        this.vy = 0;
      }
      this.y += this.vy;
      this.vx = 0;
      this.vy = 0;

      if(!(core.input.s) && !flag){
        flag = 1;
      }
      if(core.input.s && flag){
        bullet = new Bullet(this.x,this.y);
        flag = 0;
      }
    });

    // rootSceneに「player」を追加する
    core.rootScene.addChild( player );

    core.rootScene.on('touchmove', function(e){
      if((e.x < 560 || e.x > 592) && (e.y < 2 || e.y > 34)){
        player.x = e.x;
        player.y = e.y;
      }
    });

    core.rootScene.on('touchmove', function(){
      if(core.frame % 2 == 0){
        bullet = new Bullet(player.x, player.y);
      }
    });

    var shape = new Entity();
    shape.width = 202;
    shape.height = 10;
    shape.backgroundColor = "#ffffff";
    shape.x = 279;
    shape.y = 1;

    //緑色のバー
    //barというSpriteに、BarElement1というSurface画像を登録。
    var bar = new Entity();
    bar.width = 200;
    bar.height = 8;
    bar.backgroundColor = '#00ff00';
    bar.x = 280;
    bar.y = 2;

    //barの挙動。現在のLIFE値の長さになるように、width値を変更する。

    bar.addEventListener('enterframe', function() {
      if(player.width >= 200){
        ;
      }else{
        this.width = player.lifeVal;
      }
    });

    //赤色のバー
    //ダメージを受けた後、LIFE現在値までジワジワ減っていく
    var lifeBar = new Entity();
    lifeBar.width = 200;
    lifeBar.height = 8;
    lifeBar.x = 280;
    lifeBar.y = 2;
    lifeBar.backgroundColor = '#ff0000';
    lifeBar.val = player.lifeVal;

    lifeBar.addEventListener('enterframe', function() {
      if(this.val > player.lifeVal){
        this.val -= 2.0;
      }
      this.width = this.val;
    });
    //LIFEゲージをまとめたグループ
    var lifeBarGroup = new Group();
    lifeBarGroup.addChild(shape);
    lifeBarGroup.addChild(lifeBar);
    lifeBarGroup.addChild(bar);

    //LIFEゲージなどをゲーム画面に登録
    core.rootScene.addChild(lifeBarGroup);

    //一時停止ボタン
    var pause = new Sprite(32,32);
    pause.image = core.assets[PAUSE_IMAGE];
    pause.x = 560;
    pause.y = 2;
    pause.frame = 0;

    pause.addEventListener('touchstart',function(e){
      if(this.frame == 0){
        core.pause();
        this.frame = 1;
      }else if(this.frame == 1){
        core.resume();
        this.frame = 0;
      }
    });

    core.rootScene.addChild(pause);

    // rootSceneの「enterframe」イベントリスナ
    core.rootScene.addEventListener( 'enterframe', function( e ) {
      // 制限時間が「0」なら
      if( core.limitTime == 0 )
      {
        core.end( null, null, core.assets[TIMEUP_IMAGE] );
        alert('あなたの取得単位数は「' + core.score + '」単位です。');
      }
      // 体力が0になったら
      if( player.lifeVal == 0 )
      {
        setTimeout("core.end( null, null, core.assets[END_IMAGE] )",200);
      }
      // 1秒間隔で実行する処理
      if( core.frame % core.fps == 0 )
      {
        // 制限時間をカウントダウンして更新する
        core.limitTime --;
        timeLabel.text = 'TIME' + core.limitTime;
        // スコアを更新する
        scoreLabel.score = core.score;
      }

      // フレーム毎に実行する処理
      var maxX = $(window).width() - 32;
      var maxY = $(window).height() - 32;
      var minX = player.x + 200;
      var minY = 32;
      if( core.frame % 10 == 0 )//10フレーム毎
      {
        var en_x = Math.floor( Math.random() * (maxX + 1 - minX) ) + minX ;
        var en_y = Math.floor( Math.random() * (maxY + 1 - minY) ) + minY ;

        var obstacle = new Obstacle( en_x, en_y );
      }
      if(core.frame % 50 == 0)//35フレーム毎
      {
        var mazai_x = Math.floor( Math.random() * (maxX + 1 - minX) ) + minX ;
        var mazai_y = Math.floor( Math.random() * (maxY + 1 - minY) ) + minY ;

        var mazai = new Mazai( mazai_x, mazai_y );
      }
      if(core.frame % 30 == 0)//40フレーム毎
      {
        var unit_x = Math.floor( Math.random() * (maxX + 1 - minX + 50) ) + minX + 50 ;
        var unit_y = Math.floor( Math.random() * (maxY + 1 - minY) ) + minY ;

        var unit = new UNIT( unit_x, unit_y );
      }
    });

    // 制限時間（残り時間）をフォントで表示するラベルを作成する
    // 引数はラベル表示位置のxy座標
    var timeLabel = new MutableText( 10, 0 );
    // 表示する文字列の初期設定
    timeLabel.text = 'TIME:' + core.limitTime;
    // rootSceneに「timeLabel」を追加する
    core.rootScene.addChild( timeLabel );

    // スコアをフォントで表示するラベルを作成する
    // 引数はラベル表示位置のxy座標
    var scoreLabel = new ScoreLabel( 140, 0 );
    // スコアの初期値
    scoreLabel.score = 0;
    // イージング表示なしに設定する
    scoreLabel.easing = 0;
    core.rootScene.addChild( scoreLabel );
  }

  // ゲームスタート
  core.start();
};

var Bullet = enchant.Class.create(Sprite,{
  initialize: function(x, y){
    Sprite.call(this, 16, 16);
    this.image = core.assets[BULLET_IMAGE];
    this.x = x;
    this.y = y;
    this.frame = 15;
    core.rootScene.addChild(this);
  },
  onenterframe: function(){
    this.x += 4;
    if(this.x >= 1320){
      this.remove();
    }
  },
  // 「remove」メソッド
  remove:function() {
    // このスプライトをrootSceneから削除する
    core.rootScene.removeChild( this );
    // このスプライトを削除する
    delete this;
  },
});

// 障害物のスプライトを作成するクラス
var Obstacle = enchant.Class.create( enchant.Sprite, {
  // 「initialise」メソッド（コンストラクタ）
  initialize: function( x, y, mode ) {
    // 継承元をコール
    enchant.Sprite.call( this, 32, 32 );
    // 画像に「icon0.png」を使用する
    this.image = core.assets[ICON_IMAGE];
    this.x = x;                // x座標
    this.y = y;                // y座標
    this.frame = 0;           // フレーム番号
    this.score = 1;
    this.HP = 1;
    // rootSceneに「Obstacle」を追加する
    core.rootScene.addChild( this );
  },
  move:function(){
    this.x -= 4;
    if( this.x < -16 )
    {
      this.remove();
    }
    // このスプライトとプレイヤーの当たり判定
    if( this.within( player, 16 ) )
    {
      // 当たったら「スコア　-10点」
      player.lifeVal -= 10; //体力を減らす
      explo = new Explosion(this.x, this.y); //爆発させる
      this.remove();
    }
  },
  onenterframe: function() {
    this.move()
    if(this.x<-32){
      core.rootScene.removeChild(this)
    }

    var hits = this.intersect(Bullet);
    if(hits.length > 0){ //一つ以上あたっていたら
      this.HP--; //ヒットポイントを減らす
      if(this.HP <= 0){ //ヒットポイントが0以下になったら
        core.rootScene.removeChild(this); //自分を消す
      }
      explo = new Explosion(this.x, this.y); //爆発させる
      for(i = 0; i < hits.length; i++){
        core.rootScene.removeChild(hits[i]);
      }
    }
  },
  // 「remove」メソッド
  remove:function() {
    // このスプライトをrootSceneから削除する
    core.rootScene.removeChild( this );
    // このスプライトを削除する
    delete this;
  },
});

// 単位のスプライトを作成するクラス
var UNIT = enchant.Class.create( enchant.Sprite, {
  // 「initialise」メソッド（コンストラクタ）
  initialize: function( x, y, mode ) {
    // 継承元をコール
    enchant.Sprite.call( this, 32, 32 );
    // 画像に「icon0.png」を使用する
    this.image = core.assets[TANI_IMAGE];
    this.x = x;                // x座標
    this.y = y;                // y座標
    this.score = 1;
    // rootSceneに「Obstacle」を追加する
    core.rootScene.addChild( this );
  },
  move:function(){
    this.x -= 6;
    if( this.x < -16 )
    {
      this.remove();
    }
    // このスプライトとプレイヤーの当たり判定
    if( this.within( player, 16 ) )
    {
      // 当たったら「スコア加点」
      core.score += this.score;
      this.remove();
    }
  },
  onenterframe: function() {
    this.move()
    if(this.x<-32){
      core.rootScene.removeChild(this)
    }
  },
  // 「remove」メソッド
  remove:function() {
    // このスプライトをrootSceneから削除する
    core.rootScene.removeChild( this );
    // このスプライトを削除する
    delete this;
  },
});

var Explosion = enchant.Class.create(Sprite, // Spriteクラスを継承
  {
    initialize: function(x, y) { //初期化する
      Sprite.call(this, 32, 32); //Spriteオブジェクトを初期化
      this.image = core.assets[EFFECT_IMAGE];
      this.x = x;
      this.y = y;
      core.rootScene.addChild(this);
    },
    //enterframeイベントのリスナーを定義する
    onenterframe: function() {
      if(this.age % 3 == 0){ //2フレームに一度だけコマを進める
        this.frame++;
      }
      if(this.age>10){ //10フレーム経ったら爆発を消す
        core.rootScene.removeChild(this)
      }
    }
  });

  //回復アイテムのスプライト
  var Mazai = enchant.Class.create(enchant.Sprite,
    {
      initialize:function(x,y){
        Sprite.call(this,32,32);
        this.image = core.assets[MAZAI_IMAGE];
        this.x = x;
        this.y = y;
        core.rootScene.addChild(this);
      },
      move:function(){
        this.x -= 5;
        if( this.x < -16 ){
          this.remove();
        }
        if( this.within( player, 16 ) )
        {
          if(player.lifeVal >= 200){
            this.remove();
          }else{
            player.lifeVal += 10; //体力を回復する
            this.remove();
          }
        }
      },
      onenterframe: function() {
        this.move()
        if(this.x<-32){
          core.rootScene.removeChild(this)
        }
      },
      // 「remove」メソッド
      remove:function() {
        // このスプライトをrootSceneから削除する
        core.rootScene.removeChild( this );
        // このスプライトを削除する
        delete this;
      },
    });
