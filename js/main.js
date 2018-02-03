'use strict';

class Renderer {
  constructor({
    canvas,
    width,
    height,
    playerWidth,
    playerHeight,
    penguinWidth,
    penguinHeight,
    backgroundImage
  }) {
    this.canvas = canvas
      .attr({width, height})
      .css({backgroundImage: `url(${backgroundImage})`});
    this.width = width;
    this.height = height;
    this.playerWidth = playerWidth;
    this.playerHeight = playerHeight;
    this.penguinWidth = penguinWidth;
    this.penguinHeight = penguinHeight;
  }
  render(penguins, player) {
    const {
      width,
      height,
      canvas,
      playerWidth,
      playerHeight,
      penguinWidth,
      penguinHeight
    } = this;
    const ctx = canvas[0].getContext('2d');
    if (player.px !== player.x || player.py !== player.y) {
      canvas.css({'background-position': `${-player.x}px ${-player.y}px`});
    }
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2 - player.x, height / 2 - player.y);
    ctx.fillRect(
      -playerWidth / 2 + player.x,
      -playerHeight / 2 + player.y,
      playerWidth,
      playerHeight
    );
    penguins.forEach(penguin => {
      ctx.save();
      ctx.translate(penguin.x, penguin.y);
      ctx.fillStyle = 'black';
      ctx.fillRect(
        -penguinWidth / 2,
        -penguinHeight / 2,
        penguinWidth,
        penguinHeight
      );
      ctx.fillStyle = 'orange';
      ctx.fillRect(
        penguinWidth / 2 * Math.cos(penguin.langle) - 2.5,
        penguinWidth / 2 * (Math.sin(penguin.langle) + 1) -
          2.5 -
          penguinHeight / 2,
        5,
        5
      );
      ctx.restore();
    });
    ctx.restore();
  }
}

const playerWidth = 50;
const playerHeight = 80;
const numPengs = 5;
const penguinWidth = 40;
const penguinHeight = 60;

const movementTypes = [
  (penguin, frame) => {
    const cycle = (frame / 800) % 1;
    if (cycle < 0.4) {
      penguin.x--;
      penguin.langle = Math.PI;
    } else if (cycle > 0.5 && cycle < 0.9) {
      penguin.x++;
      penguin.langle = 0;
    }
  },
  (penguin, frame) => {
    const cycle = (frame / 800) % 1;
    if (cycle < 0.4) {
      penguin.y--;
      penguin.langle = Math.PI * 3 / 2;
    } else if (cycle > 0.5 && cycle < 0.9) {
      penguin.y++;
      penguin.langle = Math.PI / 2;
    }
  }
];

const player = {x: 0, y: 0};
const pressing = {};
const penguins = [];
let frame = 0;

for (let i = 0; i < numPengs; i++) {
  const angle = i / numPengs * 2 * Math.PI;
  penguins[i] = {
    x: 200 * Math.cos(angle),
    y: 200 * Math.sin(angle),
    type: i % 2
  };
}

const renderer = new Renderer({
  canvas: $('#canvas'),
  width: 800,
  height: 400,
  playerWidth,
  playerHeight,
  penguinWidth,
  penguinHeight,
  backgroundImage: 'img/snow.jpg'
});

const loop = () => {
  player.px = player.x;
  player.py = player.y;
  if (pressing.a || pressing.ArrowLeft) player.x--;
  if (pressing.s || pressing.ArrowDown) player.y++;
  if (pressing.d || pressing.ArrowRight) player.x++;
  if (pressing.w || pressing.ArrowUp) player.y--;
  penguins.forEach(penguin => movementTypes[penguin.type](penguin, frame));

  renderer.render(penguins, player);

  frame++;
  requestAnimationFrame(loop);
};
loop();

$(window).on('keyup keydown', e => {
  const key = e.originalEvent.key;
  pressing[key] = e.type === 'keydown';
});
