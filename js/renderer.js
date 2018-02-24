'use strict';

export class Renderer {
  constructor({canvas, width, height, backgroundImage}) {
    this.canvas = canvas
      .attr({width, height})
      .css({backgroundImage: `url(${backgroundImage})`});
    this.width = width;
    this.height = height;
  }
  render(penguins, player) {
    const {width, height, canvas} = this;
    const ctx = canvas[0].getContext('2d');
    if (player.px !== player.x || player.py !== player.y) {
      canvas.css({'background-position': `${-player.x}px ${-player.y}px`});
    }
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2 - player.x, height / 2 - player.y);
    ctx.fillRect(
      -player.width / 2 + player.x,
      -player.height / 2 + player.y,
      player.width,
      player.height
    );
    penguins.forEach(penguin => {
      ctx.save();
      ctx.translate(penguin.x, penguin.y);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        penguin.sightDist,
        penguin.langle - penguin.sightAngle,
        penguin.langle + penguin.sightAngle
      );
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.fillRect(
        -penguin.width / 2,
        -penguin.height / 2,
        penguin.width,
        penguin.height
      );
      ctx.fillStyle = 'orange';
      ctx.fillRect(
        penguin.width / 2 * Math.cos(penguin.langle) - 2.5,
        penguin.width / 2 * (Math.sin(penguin.langle) + 1) -
          2.5 -
          penguin.height / 2,
        5,
        5
      );

      ctx.restore();
    });
    ctx.restore();
  }
}
