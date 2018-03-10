'use strict';

const drawPeng = (pengObj, beakColor, ctx) => {
  //peng body
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(0, 0, pengObj.rad, 0, 2 * Math.PI);
  ctx.fill();
  //peng beak
  ctx.save();
  ctx.rotate(pengObj.langle);
  ctx.fillStyle = beakColor;
  ctx.beginPath();
  ctx.moveTo(pengObj.rad, pengObj.rad / 2);
  ctx.lineTo(pengObj.rad * 1.3, 0);
  ctx.lineTo(pengObj.rad, -pengObj.rad / 2);
  ctx.fill();
  ctx.restore();
};

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
    ctx.translate(width / 2, height / 2);
    drawPeng(player, 'yellow', ctx);
    //penguin drawing
    ctx.translate(-player.x, -player.y);
    penguins.forEach(penguin => {
      ctx.save();
      ctx.translate(penguin.x, penguin.y);
      ctx.fillStyle = 'rgba(200, 200, 255, 0.25)';
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
      drawPeng(penguin, 'orange', ctx);
      ctx.restore();
    });
    ctx.restore();
  }
}
