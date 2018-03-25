'use strict';

import {Renderer} from './renderer.js';
import {collideFix, movePenguin, movePlayer} from './functions.js';

class Game {
  constructor() {
    this.level = 1;
    this.pressing = {};
    this.renderer = new Renderer({
      canvas: $('#canvas'),
      width: 800,
      height: 400,
      backgroundImage: 'img/snow.jpg'
    });
    this.reset();
    this.loop();

    $(window).on('keyup keydown', e => {
      const key = e.originalEvent.key;
      this.pressing[key] = e.type === 'keydown';
      if (this.pressing.r) this.reset();
      if ((this.gameWon || this.gameLost) && this.pressing.Enter) {
        this.level = this.gameWon ? this.level + 1 : 1;
        this.reset();
      }
    });
  }
  reset() {
    this.gameWon = false;
    this.gameLost = false;

    this.player = {
      x: 0,
      y: 0,
      rad: 25,
      langle: 0,
      punchCounter: 0,
      punchingDuration: 25,
      punchDelay: 85,
      armLength: 50,
      dead: false,
      speed: 2
    };

    this.numPengs = this.level + 2;
    this.numRocks = Math.floor(this.level / 3);
    this.rocks = [];
    this.penguins = [];
    this.frame = 0;

    for (let i = 0; i < this.numPengs; i++) {
      const angle = i / this.numPengs * 2 * Math.PI;
      this.penguins[i] = {
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

    for (let x = 0; x < this.numRocks; x++) {
      const angle = x / this.numRocks * 2 * Math.PI;
      this.rocks[x] = {
        x: 200 * Math.cos(angle),
        y: 200 * Math.sin(angle),
        rad: 30,
        isStationary: true
      };
    }
  }

  loop() {
    const {player, pressing, penguins, renderer, frame, loop, rocks} = this;
    movePlayer(player, pressing);
    penguins.forEach(penguin => movePenguin(penguin, player, frame, rocks));
    collideFix([...penguins, player], rocks);

    if (player.dead) this.gameLost = true;
    if (penguins.every(peng => peng.dead)) this.gameWon = true;

    renderer.render(this);
    this.frame++;
    requestAnimationFrame(loop.bind(this));
  }
}

new Game();
