'use strict';

import {Renderer} from './renderer.js';

const overlapTest = (a, b) => {
  const overlapX = (a.width + b.width) / 2 - Math.abs(a.x - b.x);
  const overlapY = (a.height + b.height) / 2 - Math.abs(a.y - b.y);
  if (overlapX > 0 && overlapY > 0) {
    if (overlapX > overlapY) {
      //TODO: which is higher? change Y
      a.y;
    } else {
      //TODO: which is to the left and right?
    }
  }
};

const collideCompare = objects => {
  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      overlapTest(objects[i], objects[j]);
    }
  }
};

const getAngle = (dy, dx) => {
  const a = Math.atan2(dy, dx);
  return a < 0 ? a + Math.PI * 2 : a;
};

const numPengs = 5;

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

const movePenguin = (penguin, player, frame) => {
  const dx = player.x - penguin.x;
  const dy = player.y - penguin.y;
  const dist = Math.hypot(dx, dy);
  const M = penguin.speed / dist;
  const langle = getAngle(dy, dx);
  const absDiff = Math.abs(langle - penguin.langle);
  if (
    dist < penguin.sightDist &&
    (absDiff < penguin.sightAngle || absDiff > 2 * Math.PI - penguin.sightAngle)
  ) {
    penguin.x += dx * M;
    penguin.y += dy * M;
    penguin.langle = langle;
  } else {
    movementTypes[penguin.type](penguin, frame);
  }
};

const player = {x: 0, y: 0, width: 50, height: 80};
const pressing = {};
const penguins = [];
let frame = 0;

for (let i = 0; i < numPengs; i++) {
  const angle = i / numPengs * 2 * Math.PI;
  penguins[i] = {
    x: 200 * Math.cos(angle),
    y: 200 * Math.sin(angle),
    type: i % 2,
    speed: Math.random() * 0.5 + 0.2,
    sightDist: Math.random() * 200 + 100,
    sightAngle: Math.random() * Math.PI / 16 + Math.PI / 16,
    langle: angle,
    width: 40,
    height: 60
  };
}

const renderer = new Renderer({
  canvas: $('#canvas'),
  width: 800,
  height: 400,

  backgroundImage: 'img/snow.jpg'
});

const loop = () => {
  player.px = player.x;
  player.py = player.y;
  if (pressing.a || pressing.ArrowLeft) player.x--;
  if (pressing.s || pressing.ArrowDown) player.y++;
  if (pressing.d || pressing.ArrowRight) player.x++;
  if (pressing.w || pressing.ArrowUp) player.y--;
  penguins.forEach(penguin => movePenguin(penguin, player, frame));

  renderer.render(penguins, player);

  frame++;
  requestAnimationFrame(loop);
};
loop();

$(window).on('keyup keydown', e => {
  const key = e.originalEvent.key;
  pressing[key] = e.type === 'keydown';
});
