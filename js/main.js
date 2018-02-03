"use strict"

const canvasWidth = 800;
const canvasHeight = 400;
const playerWidth = 50;
const playerHeight = 80;
const numPengs = 10;
const penguinWidth = 40;
const penguinHeight = 60;

const player = {x: 0, y: 0};
const pressing = {};
const penguins = []

for (let i = 0; i < numPengs; i ++){
  const angle = i/numPengs*2*Math.PI;
  penguins[i] = {x: 200*Math.cos(angle), y: 200*Math.sin(angle)};
}

const canvas = $("#canvas").attr({width: canvasWidth, height: canvasHeight}).css({backgroundImage: "url(img/snow.jpg)"});

const ctx = canvas[0].getContext('2d');
const loop = () => {
  player.px = player.x;
  player.py = player.y;
  if (pressing.a || pressing.ArrowLeft) player.x--;
  if (pressing.s || pressing.ArrowDown) player.y++;
  if (pressing.d || pressing.ArrowRight) player.x++;
  if (pressing.w || pressing.ArrowUp) player.y--;
  if (player.px !== player.x || player.py !== player.y) {
    canvas.css({"background-position": `${-player.x}px ${-player.y}px`})
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.save();
  ctx.translate(canvasWidth/2 - player.x, canvasHeight/2 - player.y);
  ctx.fillRect(-playerWidth/2 + player.x, -playerHeight/2 + player.y, playerWidth, playerHeight);
  penguins.forEach(penguin => ctx.fillRect(-penguinWidth/2 + penguin.x, -penguinHeight/2 + penguin.y, penguinWidth, penguinHeight));
  ctx.restore();
  requestAnimationFrame(loop);
}
loop();




$(window).on("keyup keydown", e => {
  const key = e.originalEvent.key;
  pressing[key] = e.type == "keydown";
})
