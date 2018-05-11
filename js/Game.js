'use strict';

import {Renderer} from './renderer.js';
import {collideFix, createWall} from './functions.js';
import {PenguinTypes} from './PenguinTypes.js';
import {Player} from './Player.js';

class Game {
  constructor() {
    this.pressing = {};
    this.renderer = new Renderer({
      canvas: $('#canvas'),
      width: 800,
      height: 400,
      backgroundImage: 'img/snow.jpg'
    });
    this.reset();
    this.startLevel();
    this.loop();
    let typeIndex = 0;
    let maxTypeIndex = 1;

    $(window).on('keyup keydown', e => {
      const key = e.originalEvent.key;
      this.pressing[key] = e.type === 'keydown';
      if (this.pressing.r) this.startLevel();
      if ((this.gameWon || this.gameLost) && this.pressing.Enter) {
        if (this.gameWon) {
          this.level++;
          this.pengTypes.push(typeIndex);
          typeIndex++;
          if (typeIndex > maxTypeIndex) {
            typeIndex = 0;
            if (maxTypeIndex < PenguinTypes.length - 1) maxTypeIndex++;
          }
        } else this.reset();
        this.startLevel();
      }
    });
  }
  reset() {
    this.level = 1;
    this.pengTypes = [0, 1, 2, 3];
  }
  startLevel() {
    this.gameWon = false;
    this.gameLost = false;

    this.player = new Player();

    this.numRocks = Math.floor(this.level / 3);
    this.rocks = [];
    this.penguins = [];
    this.frame = 0;

    for (let i = 0; i < this.pengTypes.length; i++) {
      const angle = i / this.pengTypes.length * 2 * Math.PI;
      const PenguinType = PenguinTypes[this.pengTypes[i]];

      this.penguins[i] = new PenguinType({
        x: 300 * Math.cos(angle),
        y: 300 * Math.sin(angle),
        langle: angle
      });
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

    const bordRad = 100;
    const wallDist = 1000;

    const wall = [
      {x: -wallDist, y: 0},
      {x: 0, y: -wallDist},
      {x: wallDist, y: 0},
      {x: 0, y: wallDist}
    ];

    wall.forEach((corner, i) => {
      this.rocks.push(
        ...createWall(corner, wall[(i + 1) % wall.length], bordRad)
      );
    });
  }

  loop() {
    const {player, pressing, penguins, renderer, loop, rocks} = this;
    player.move(pressing);
    const deadPengs = penguins.filter(el => el.dead);
    penguins.forEach(penguin => penguin.move(player, rocks, deadPengs));
    collideFix([player, ...penguins], rocks);

    if (player.dead) this.gameLost = true;
    if (penguins.every(peng => peng.dead)) this.gameWon = true;

    renderer.render(this);
    this.frame++;
    requestAnimationFrame(loop.bind(this));
  }
}

new Game();
