'use strict';

import {Renderer} from './renderer.js';

const isHitting = (player, penguin) => {
  if (player.punchCounter <= 0) return false;
  const fistDist = Math.hypot(player.armLength, player.rad / 2);
  const fistAngle =
    Math.atan2(player.rad / 2, player.armLength) + player.langle;
  const fistX = Math.cos(fistAngle) * fistDist + player.x;
  const fistY = Math.sin(fistAngle) * fistDist + player.y;
  return Math.hypot(fistX - penguin.x, fistY - penguin.y) < penguin.rad;
};

const overlapFix = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = Math.hypot(dx, dy);
  const overlap = a.rad + b.rad - dist;
  if (overlap > 0) {
    const m = overlap / 2 / dist;
    a.x += m * dx;
    a.y += m * dy;
    b.x -= m * dx;
    b.y -= m * dy;
  }
};

const collideFix = objects => {
  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      overlapFix(objects[i], objects[j]);
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
  if (penguin.dead) return;
  const dx = player.x - penguin.x;
  const dy = player.y - penguin.y;
  const dist = Math.hypot(dx, dy);
  const langle = getAngle(dy, dx);
  const absDiff = Math.abs(langle - penguin.langle);
  if (
    dist < penguin.sightDist &&
    (absDiff < penguin.sightAngle || absDiff > 2 * Math.PI - penguin.sightAngle)
  ) {
    const M = penguin.speed / dist;
    penguin.x += dx * M;
    penguin.y += dy * M;
    penguin.langle = langle;
  } else {
    movementTypes[penguin.type](penguin, frame);
    if (isHitting(player, penguin)) {
      penguin.dead = true;
    }
  }
};

const player = {
  x: 0,
  y: 0,
  rad: 25,
  langle: 0,
  punchCounter: 0,
  punchingDuration: 25,
  punchDelay: 85,
  armLength: 50
};
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
    sightAngle: Math.random() * Math.PI / 16 + Math.PI / 8,
    langle: angle,
    rad: 20,
    dead: false
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
  let moveX = 0;
  let moveY = 0;
  if (pressing.a || pressing.ArrowLeft) moveX--;
  if (pressing.s || pressing.ArrowDown) moveY++;
  if (pressing.d || pressing.ArrowRight) moveX++;
  if (pressing.w || pressing.ArrowUp) moveY--;
  if (pressing.f && player.punchCounter < -player.punchDelay) {
    player.punchCounter = player.punchingDuration;
  }
  if (moveX || moveY) {
    const m = 1 / Math.hypot(moveX, moveY);
    player.x += moveX * m;
    player.y += moveY * m;
    player.langle = Math.atan2(moveY, moveX);
  }
  player.punchCounter--;
  penguins.forEach(penguin => movePenguin(penguin, player, frame));
  collideFix([...penguins, player]);
  renderer.render(penguins, player);

  frame++;
  requestAnimationFrame(loop);
};
loop();

$(window).on('keyup keydown', e => {
  const key = e.originalEvent.key;
  pressing[key] = e.type === 'keydown';
});
