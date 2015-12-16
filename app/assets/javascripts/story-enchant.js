///////////////////////////////////////enchant///////////////////////////////////////////
enchant();
enchant.Sound.enabledInMobileSafari = true;
//todo グローバル変数はやばい
var player_x;
var player_y;
var chara;
var goal;
var stage;
var startImage;
var ifflag = true;
var gameOverImage;
var gameClearImage;
var moveRightCounter = 0;
var jumpCounter = 0;
var jumpflag = true;
var moveRightflag = true;
var clearflag = false;
var startScene;
var endScene;
var goalImg;
var goalPos = 320;

//後でこのディレクションを進行方向にかける
//-1にすると自動的に後ろに進むようになります
var direction = 1;
var windowWidth = window.innerWidth;
var game = new Game(320,224);

window.onload = function() {
    var Rectangle = enchant.Class.create({
        initialize: function(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        },
        right: {
            get: function() {
                return this.x + this.width;
            }
        },
        bottom: {
            get: function() {
                return this.y + this.height;
            }
        }
    });

    game.fps = 24;
    game.preload(
        '/assets/enchantImg/chara1.gif',
        '/assets/enchantImg/map2.gif',
        '/assets/enchantImg/startSceneMap.png',
        '/assets/enchantImg/start_scene_text.png',
        '/assets/enchantImg/chara1_start_scene.gif',
        '/assets/enchantImg/goalflag_start_scene.png',
        '/assets/enchantImg/coin.png',
        '/assets/enchantImg/start.png',
        '/assets/enchantImg/gameover.png',
        '/assets/enchantImg/clear.png',
        '/assets/enchantImg/flag.png'
        );

    game.change_scene = function(scene){
      game.replaceScene(scene); 
    }

    //startScene
    startScene = new Scene();
    startScene.backgroundColor = "#99FFFF";

    //endScene
    endScene = new Scene();
    endScene.backgroundColor = "#99FF99";

    //game over Scene
    gameOverScene = new Scene();
    gameOverScene.backgroundColor = "#fff";

    game.onload = function() {
        //create startScene map
        var start_scene_map_blocks = gon.start_scene_map; 
        var startSceneMap = new Map(8,8);
        startSceneMap.image = game.assets['/assets/enchantImg/startSceneMap.png'];
        startSceneMap.loadData(start_scene_map_blocks);
        startScene.addChild(startSceneMap);

        //start scene text
        startSceneText = new Sprite(200,42);
        startSceneText.x = 60;
        startSceneText.y = 50;
        startSceneText.image = game.assets['/assets/enchantImg/start_scene_text.png'];
        startScene.addChild(startSceneText);
        
        //start scene character 
        startSceneChara = new Sprite(16,16);
        startSceneChara.x = 10;
        startSceneChara.y = 152;
        startSceneChara.image = game.assets['/assets/enchantImg/chara1_start_scene.gif'];
        startScene.addChild(startSceneChara);

        //start scene goal flag
        startSceneGoal= new Sprite(50,38);
        startSceneGoal.x = gon.goal_pos[0] / 2;
        startSceneGoal.y = gon.goal_pos[1] * 2;
        startSceneGoal.image = game.assets['/assets/enchantImg/goalflag_start_scene.png'];
        startScene.addChild(startSceneGoal);

        //create map
        var blocks = gon.map; 
        var map = new Map(16, 16);
        map.image = game.assets['/assets/enchantImg/map2.gif'];
        map.loadData(blocks);
        

        //game over image
        gameOverImage = new Sprite(189,97);
        gameOverImage.image = game.assets['/assets/enchantImg/gameover.png'];
        gameOverImage.addEventListener('touchstart', function() {
          window.location.reload();
        });

        //game clear image
        gameClearImage= new Sprite(235,57);
        gameClearImage.y = 100;
        gameClearImage.image = game.assets['/assets/enchantImg/clear.png'];
        endScene.addChild(gameClearImage);

        //goal image
        goalImg = new Sprite(100,100);
        goalImg.x = gon.goal_pos[0];
        goalImg.y = gon.goal_pos[1];
        goalImg.image = game.assets['/assets/enchantImg/flag.png'];


        //main character
        chara = new Sprite(32, 32);
        chara.x = 8;
        chara.y = 143;
        chara.vx = 0;
        chara.vy = 0;
        chara.ax = 0;
        chara.ay = 0;
        chara.pose = 0;
        chara.jumping = true;
        chara.jumpBoost = 0;
        chara.image = game.assets['/assets/enchantImg/chara1.gif'];
        chara.addEventListener('enterframe', function(e) {
            player_x = chara.x;
            player_y = chara.y;


            if (this.ax != 0) {
                if (game.frame % 3 == 0) {
                    this.pose++;
                    this.pose %= 2;
                }
                this.frame = this.pose + 1;
            } else {
                this.frame = 0;
            }

            this.vy += this.ay + 2 ; //重力
            this.vy = Math.min(Math.max(this.vy, -10), 10);

            var dest = new Rectangle(
                this.x + this.vx + 5, this.y + this.vy + 2,
                this.width-10, this.height-2
            );

            if (dest.x < -stage.x) {
                dest.x = -stage.x;
                this.vx = 0;
            }

            while (true) {
                var boundary, crossing;
                var dx = dest.x - this.x - 5;
                var dy = dest.y - this.y - 2;
                if (dx > 0 && Math.floor(dest.right / 16) != Math.floor((dest.right - dx) / 16)) {
                    boundary = Math.floor(dest.right / 16) * 16;
                    crossing = (dest.right - boundary) / dx * dy + dest.y;
                    if ((map.hitTest(boundary, crossing) && !map.hitTest(boundary-16, crossing)) ||
                        (map.hitTest(boundary, crossing + dest.height) && !map.hitTest(boundary-16, crossing + dest.height))) {
                        this.vx = 0;
                        dest.x = boundary - dest.width - 0.01;
                        continue;
                    }
                } else if (dx < 0 && Math.floor(dest.x / 16) != Math.floor((dest.x - dx) / 16)) {
                    boundary = Math.floor(dest.x / 16) * 16 + 16;
                    crossing = (boundary - dest.x) / dx * dy + dest.y;
                    if ((map.hitTest(boundary-16, crossing) && !map.hitTest(boundary, crossing)) ||
                        (map.hitTest(boundary-16, crossing + dest.height) && !map.hitTest(boundary, crossing + dest.height))) {
                        this.vx = 0;
                        dest.x = boundary + 0.01;
                        continue;
                    }
                }
                if (dy > 0 && Math.floor(dest.bottom / 16) != Math.floor((dest.bottom - dy) / 16)) {
                    boundary = Math.floor(dest.bottom / 16) * 16;
                    crossing = (dest.bottom - boundary) / dy * dx + dest.x;
                    if ((map.hitTest(crossing, boundary) && !map.hitTest(crossing, boundary-16)) ||
                        (map.hitTest(crossing + dest.width, boundary) && !map.hitTest(crossing + dest.width, boundary-16))) {
                        this.jumping = false;
                        this.vy = 0;
                        dest.y = boundary - dest.height - 0.01;
                        continue;
                    }
                } else if (dy < 0 && Math.floor(dest.y / 16) != Math.floor((dest.y - dy) / 16)) {
                    boundary = Math.floor(dest.y / 16) * 16 + 16;
                    crossing = (boundary - dest.y) / dy * dx + dest.x;
                    if ((map.hitTest(crossing, boundary-16) && !map.hitTest(crossing, boundary)) ||
                        (map.hitTest(crossing + dest.width, boundary-16) && !map.hitTest(crossing + dest.width, boundary))) {
                        this.vy = 0;
                        dest.y = boundary + 0.01;
                        continue;
                    }
                }

                break;
            }
            this.x = dest.x-5;
            this.y = dest.y-2;

            if (this.y > goalPos) {
                this.frame = 3;
                this.vy = -20;
                this.addEventListener('enterframe', function() {
                    this.vy += 2;
                    this.y += Math.min(Math.max(this.vy, -10), 10);
                });
                this.removeEventListener('enterframe', arguments.callee);
            }
        });

        stage = new Group();
        stage.addChild(map);
        stage.addChild(chara);
        stage.addChild(goalImg);
        stage.addEventListener('enterframe', function(e) {
            if (this.x > 64 - chara.x) { 
                this.x = 64 - chara.x;
            }
        });
        game.rootScene.addChild(stage);
        game.rootScene.backgroundColor = 'rgb(182, 255, 255)';

    };
    game.start();
    game.change_scene(startScene);
};

function actionFlagTrue(){
    moveRightflag = true;
}

///////////////////////////////////////終了系処理///////////////////////////////////////////
function programEnd(){
  if(!clearflag){
    gameOverImage.x = player_x;
    gameOverImage.y = 50;
    stage.addChild(gameOverImage);

    window.setTimeout(function(){
      $('#gameOverPopup').css({
        "visibility":"visible",
        "zIndex": "2" 
      });
    },1000);
    game.stop();
  }
}

function clear(){
  gameClearImage.x = player_x - 20;
  stage.addChild(gameClearImage);
  if(!clearflag){
    $.ajax({
        url: "clear",
        type: "POST",
        data: {
           stageNum:getStageParams()
        },
        success:function(){
        },
        error:function(xml,text,error){
          alert("clear!!! demo http sippai sityattayo!!!") 
        },
            dataType: "html"
        });
    clearflag = true;
  }

  window.setTimeout(function(){
    if(gon.new_block_user_can_get != undefined && gon.new_block_user_can_get.length > 0){
        var clearInfoText = $('<strong>ゲットしたブロック</strong><br>');
        clearInfoText.appendTo("#clearPopupGetBlockInfo");
      for(var i=0;i<gon.new_block_user_can_get.length;i++){
        var blockName = gon.new_block_user_can_get[i].name;
        var blockDesc = gon.new_block_user_can_get[i].desc;
        var clearInfo = $(
          '<li class="panel panel-default"><div class="panel panel-heading">'+blockName+'</div><div class="panel panel-body">'+blockDesc+'</div></li><br>');
        clearInfo = clearInfo.css({
          "color":"black"
        });
        clearInfo.appendTo("#clearPopupGetBlockInfo");
      }
    }

    $('#clearPopup').css({
      "visibility":"visible",
      "zIndex": "2" 
    });
  },1000);

}

function debugClear(){
  game.replaceScene(game.rootScene);
  clear();
}

function programEnd(){
  if(!clearflag){
    gameOverImage.x = player_x;
    gameOverImage.y = 50;
    stage.addChild(gameOverImage);

    window.setTimeout(function(){
      $('#gameOverPopup').css({
        "visibility":"visible",
        "zIndex": "2" 
      });
    },1000);
    game.stop();
  }
}

//todo railsdでクエリをパースする
function getStageParams(){
  var url = location.href;
  var params = url.split("?");
  if(params.length > 0){
    var num = params[1].split("=");
    return num[1];
  }else{
    return 0; 
  }
}

var codeBlocks = [];
var forBlocks = [];


//enchantからブロック処理の合図を受け取る
function finishBlockProcess(){
  if(forBlocks.shift() != undefined || codeBlocks.shift() != undefined){
    blockAction();
  }
}

/////////////////////////////////jqueryのドラックアンドドロップとか////////////////////////////
$(document).ready(function(){
  /*実行したい処理*/
  var draggedItem;
  $( '#sort-drop-area' ).sortable( {
    revert: true,
    beforeStop: function (event, ui) { 
      draggedItem = ui.item;
    },
    receive: function(event,ui) {
      draggedItem.attr("id","block_"+ui.item[0].value);
      draggedItem.append("<button class='btn btn-default btn-xs' onClick='$(this).parent().remove()' style='float:right'>x</button>");
      if(ui.item[0].value==4){
        //if block
          checkBlockNeedEndBlock(ui.item[0]); 
          draggedItem.append("<select name='ifblock' style='float:right'><option value='1'>緑の草の上だったら</option><option value='2'>岩のブロックの上だったら</option><option value='3'>行き止まりだったら</option></select>");
      }else if(ui.item[0].value== 5){
        //for block
          checkBlockNeedEndBlock(ui.item[0]); 
          draggedItem.append("<select name='forblock' style='float:right'></select>");
          for(var i=1;i<=10;i++){
            $("<option value="+i+">"+i+"回</option>").appendTo("select");
          }
      }
    }
  });

  $( '#dragArea' ).find('li').draggable( {
     connectToSortable: '#sort-drop-area',
     helper: 'clone',
     revert: 'invalid',
     start: function(event, ui){
        ifflag=true;
        forflag=true;
    }
  });

  //配列の中身->ブロックのデータ（ブロックの名前、ブロックの処理が終わったかどうか）
  $("button").click(function(){
    //ブロックががあった時
    if($('li', '#drop-check').length > 0){
      //ehcnant側でゲームシーンをよぶ
      game.change_scene(game.rootScene);
      //if文ブロック、もしくはfor文のブロックのとき
      $('li', '#drop-check').each(function() {
        codeBlocks.push(this.value); 
      })              
      blockAction();
    }else{
      //ブロックがなかったとき 
      alert("ブロック入れてね");
    }
  });
  checkBlockNeedEndBlock();
  $( '#dragArea' ).disableSelection();
});

/////////////////////////////////関数を受け取る処理////////////////////////////////////////////

function receveBlockInfoWrapper(blockId){ 
  console.log("blockid"+blockId);
    if(blockId != undefined){
        actionFlagTrue();
        switch (blockId){
            case 1: 
                moveForward();
                break;
            case 2:
                changeDirection();
                break;
            case 3:
                jump();
                break;
            case 4:
                ifBlock();
                break;
            case 5:
                forBlock();
                break;
            case -4:
                endIfBlock();
                break;
            default:
                console.log("block no namae matigaeteruyo!!!")
                break;
        }
    }
}

function blockAction(){
  if(player_x > gon.goal_pos[0] && player_y > gon.goal_pos[1] - 30){
    clear(); 
  }

  if(forBlocks.length == 0 && codeBlocks.length == 0){
    programEnd();
  }else{
    if(forBlocks.length > 0){
      receveBlockInfoWrapper(forBlocks[0]);
    }else{
      receveBlockInfoWrapper(codeBlocks[0]);
    }
  }
}

/////////////////////////////////ブロックごとの処理//////////////////////////////////////
function moveForward(){
  moveRightflag = true; 
  chara.addEventListener('enterframe',function(){
    if(!clearflag){
      if(moveRightCounter < 3 && moveRightflag){
        moveRightCounter++;
        chara.ax += 1; 
      }else if(moveRightCounter < 18 && moveRightflag){
        moveRightCounter++;
      }else if(moveRightCounter < 20 && moveRightflag){
        moveRightCounter++;
        chara.ax -= 1; 
      }else if(moveRightCounter == 20){
        moveRightflag = false; 
        moveRightCounter = 0;
        chara.ax = 0;
        chara.vx = 0;
        this.removeEventListener('enterframe',arguments.callee);
        finishBlockProcess();
      }
      chara.vx = chara.ax * direction;
    }
  });
}

function changeDirection(){
    direction = direction * -1;
    chara.frame = 1;
    chara.scaleX *= -1;
    finishBlockProcess();
}

function jump(){
  jumpflag = true;
  chara.addEventListener('enterframe',function(){
    if(!clearflag){
      if(jumpCounter < 3 && jumpflag){
        jumpCounter++;
        chara.ax += 1.5; 
        chara.ay -= 2.2;
      }else if(jumpCounter < 6 && jumpflag){
        jumpCounter++;
      }else if(jumpCounter < 12 && jumpflag){
        jumpCounter++;
        chara.ay += 2;
      }else if(jumpCounter < 15 && jumpflag){
        jumpCounter++;
        chara.ax -= 1; 
      }else if(jumpCounter == 15){
        jumpflag = false; 
        jumpCounter = 0;
        chara.ax = 0;
        chara.vx = 0;
        chara.ay = 0;
        this.removeEventListener('enterframe',arguments.callee);
        finishBlockProcess();
      }
      chara.vx = chara.ax * direction;
      chara.vy = chara.ay;
    }
  });
}

function ifBlock(){
  var blockVal = $("select[name='ifblock']").val();
  switch(val){
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    default:
      break;
  }
  finishBlockProcess();
}

function forBlock(){
  var forNum = $("select[name='forblock']").val();
  var forTargetNum = 0;
  var tmpBlocks = [];
  console.log(codeBlocks);
  console.log(forNum);

  codeBlocks.shift();

  while(codeBlocks[forTargetNum]!==-5){
    tmpBlocks[forTargetNum]=codeBlocks[forTargetNum];
    forTargetNum++;
  }
  // finishBlockProcessで処理共通化をするためforBlocksの0番目はダミーを入れる
  forBlocks.push(0);
  for(i=0; i<forNum; i++){
    for(h=0; h<forTargetNum; h++){
      forBlocks.push(tmpBlocks[h]);
    }
  }

  codeBlocks.splice(0, forTargetNum+1);
  
  finishBlockProcess();
}

function endIfBlock(){
  console.log("end of if block");
  finishBlockProcess();
}
//////////////////////////////////////そのほかjquerynの処理////////////////////////////////////////
function checkBlockNeedEndBlock(){
  $("#drop-check").droppable({
     drop:function(event,ui){
      var blockValue = ui.draggable.attr('value');      
       var endBlock = $('<li>').text("end").attr("class","panel panel-default").attr("value",blockValue*-1).attr("id","block_"+blockValue);
         if(ifflag==true && blockValue== 4 || forflag ==true && blockValue== 5){
           endBlock.appendTo("#sort-drop-area");
           endBlock.append("<button class='btn btn-default btn-xs' onClick='$(this).parent().remove()' style='float:right'>x</button>");
           ifflag = false; 
           forflag= false;
        }
     }
  })
}

function showHint(){
  var hintTextHeadline = gon.hint.headline;
  var hintTextDescription = gon.hint.description;

  var hintHead = $(hintTextHeadline).attr("class","panel panel-heading").css({
    "font-size":"25px",
    "color":"black"
  });
  var hintDesc = $(hintTextDescription).attr("class","panel panel-body").css({
    "font-size":"25px",
    "color":"black"
  });

  hintHead.appendTo("#hint");
  hintDesc.appendTo("#hint");
  $('#hint').css("visibility","visible");
  $("*[name=hint_button]").remove();
}
