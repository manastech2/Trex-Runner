//Global Variable
var trex, trexRun, ground, groundImage, invisibleGround;
var cloudImage, cloudGroup, ob1, ob2, ob3, ob4, ob5, ob6, obstaclesGroup;
var PLAY, END, gameState, count, trexCollided, jump, die, checkPoint;
var gameOverImg, gameOver, restart, restartImg

function preload() {
  trexRun = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  groundImage = loadImage("ground2.png")

  cloudImage = loadImage("cloud.png")

  ob1 = loadImage("obstacle1.png")
  ob2 = loadImage("obstacle2.png")
  ob3 = loadImage("obstacle3.png")
  ob4 = loadImage("obstacle4.png")
  ob5 = loadImage("obstacle5.png")
  ob6 = loadImage("obstacle6.png")
  trexCollided = loadImage("trex_collided.png")

  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  checkPoint=loadSound("checkPoint.mp3");

  gameOverImg=loadImage("gameOver.png")
  restartImg=loadImage("restart.png")


}

function setup() {
  createCanvas(600, 200);
  trex = createSprite(50, 180, 10, 20)
  trex.addAnimation("Trex_1", trexRun)
  trex.addAnimation("Trex_2", trexCollided)

  trex.scale = 0.5

  ground = createSprite(300, 180, 600, 20);
  ground.addImage(groundImage)
  ground.velocityX = -10

  invisibleGround = createSprite(300, 185, 600, 6);
  invisibleGround.visible = false;

  cloudGroup = createGroup();
  obstaclesGroup = createGroup();

  PLAY = 1
  END = 0
  gameState = PLAY

  count = 0

  gameOver=createSprite(300,80,60,50)
  gameOver.addImage(gameOverImg)
  gameOver.scale=0.7
  gameOver.visible=false

  restart=createSprite(300,120,60,50)
  restart.addImage(restartImg);
  restart.scale=0.6
  restart.visible=false;




}

function draw() {
  background(255);
  drawSprites();
  textSize(18);
  textFont("Georgia");
  text("Score: "+ count, 400, 50);

  if (gameState === PLAY) {
    //move the ground
    ground.velocityX = -(6 + 3 * count / 100);
    //scoring
    count = count + Math.round(getFrameRate() / 60);

    if (count > 0 && count % 100 === 0) {
      checkPoint.play();
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when the space key is pressed
    if (keyDown("space") && trex.y >= 158) {
      trex.velocityY = -12;
      jump.play();
    }

    //add gravity
    trex.velocityY = trex.velocityY + 1;

    //spawn the clouds
    spawnClouds();

    //spawn obstacles
    spawnObstacles();

    //End the game when trex is touching the obstacle
    if (obstaclesGroup.isTouching(trex)) {
      //playSound("jump.mp3");
      gameState = END;
      die.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("Trex_2");

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
    reset();
     }


  }
  trex.collide(invisibleGround)


  


  


  console.log(trex.y)
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 162, 10, 40);
    obstacle.velocityX = -6

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(ob1);
        break;
      case 2:
        obstacle.addImage(ob2);
        break;
      case 3:
        obstacle.addImage(ob3);
        break;
      case 4:
        obstacle.addImage(ob4);
        break;
      case 5:
        obstacle.addImage(ob5);
        break;
      case 6:
        obstacle.addImage(ob6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 120;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState= PLAY
  obstaclesGroup.destroyEach();
  cloudGroup.destroyEach();
  gameOver.visible=false
  restart.visible=false
  count=0
  trex.changeAnimation("Trex_1")

}