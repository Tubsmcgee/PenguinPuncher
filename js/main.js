'use strict';

import {Renderer} from './renderer.js';
let player, rocks, penguins, frame;
const numPengs = 12;
const numRocks = 3;
const pressing = {};

const reset = () => {
  player = {
    x: 0,
    y: 0,
    rad: 25,
    langle: 0,
    punchCounter: 0,
    punchingDuration: 25,
    punchDelay: 85,
    armLength: 50
  };

  rocks = [];
  penguins = [];
  frame = 0;

  for (let i = 0; i < numPengs; i++) {
    const angle = i / numPengs * 2 * Math.PI;
    penguins[i] = {
      x: 300 * Math.cos(angle),
      y: 300 * Math.sin(angle),
      type: i % 2,
      speed: Math.random() * 0.5 + 0.4,
      sightDist: Math.random() * 200 + 200,
      sightAngle: Math.random() * Math.PI / 16 + Math.PI / 4,
      langle: angle,
      rad: 20,
      dead: false
    };
  }

  for (let x = 0; x < numRocks; x++) {
    const angle = x / numRocks * 2 * Math.PI;
    rocks[x] = {
      x: 200 * Math.cos(angle),
      y: 200 * Math.sin(angle),
      rad: 30,
      isStationary: true
    };
  }
};

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
    const m = b.isStationary ? overlap / dist : overlap / 2 / dist;
    a.x += m * dx;
    a.y += m * dy;
    if (!b.isStationary) {
      b.x -= m * dx;
      b.y -= m * dy;
    }
  }
};

const collideFix = (objects, rocks) => {
  for (let i = 0; i < objects.length; i++) {
    for (let x = 0; x < rocks.length; x++) {
      overlapFix(objects[i], rocks[x]);
    }
    for (let j = i + 1; j < objects.length; j++) {
      overlapFix(objects[i], objects[j]);
    }
  }
};

const obstructed = (penguin, player, rocks) => {
  const dx = player.x - penguin.x;
  const dy = player.y - penguin.y;
  const dist = Math.hypot(dx, dy);

  const ray = (penguin.ray = {x: penguin.x, y: penguin.y});
  for (let j = 0; j < 10; j++) {
    let minDist = Infinity;
    for (let i = 0; i < rocks.length; i++) {
      const rdx = rocks[i].x - ray.x;
      const rdy = rocks[i].y - ray.y;
      const rdist = Math.hypot(rdx, rdy) - rocks[i].rad;

      minDist = Math.min(minDist, rdist);
    }
    if (minDist > 1) {
      ray.x += minDist * dx / dist;
      ray.y += minDist * dy / dist;
      if (
        Math.hypot(penguin.x - ray.x, penguin.y - ray.y) >=
        dist - player.rad
      ) {
        return false;
      }
    } else {
      return true;
    }
  }
};

const getAngle = (dy, dx) => {
  const a = Math.atan2(dy, dx);
  return a < 0 ? a + Math.PI * 2 : a;
};

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

const movePenguin = (penguin, player, frame, rocks) => {
  if (penguin.dead) return;
  const dx = player.x - penguin.x;
  const dy = player.y - penguin.y;
  const dist = Math.hypot(dx, dy);
  const langle = getAngle(dy, dx);
  const absDiff = Math.abs(langle - penguin.langle);
  if (
    dist < penguin.sightDist &&
    (absDiff < penguin.sightAngle ||
      absDiff > 2 * Math.PI - penguin.sightAngle) &&
    !obstructed(
      penguin,
      player,
      rocks.filter(
        rock => Math.hypot(penguin.x - rock.x, penguin.y - rock.y) < dist
      )
    )
    //make rocks not global
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
  penguins.forEach(penguin => movePenguin(penguin, player, frame, rocks));
  collideFix([...penguins, player], rocks);
  renderer.render(penguins, player, rocks);

  frame++;
  requestAnimationFrame(loop);
};
reset();
loop();

$(window).on('keyup keydown', e => {
  const key = e.originalEvent.key;
  pressing[key] = e.type === 'keydown';
  if (pressing.r) reset();
});
