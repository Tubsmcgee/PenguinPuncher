'use strict';

import {Renderer} from './renderer.js';
import {collideFix, movePenguin} from './functions.js';

const init = () => {
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
      armLength: 50,
      dead: false
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
        dead: false,
        suspicion: 0,
        suspicionRate: Math.random() / 500,
        suspicionDecrement: 0.002
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
};

init();
