'use strict';

const drawPeng = (
  {rad, langle, punchCounter, armLength, dead, x, y, sightDist, sightAngle},
  beakColor,
  ctx
) => {
  ctx.save();
  ctx.translate(x, y);
  if (sightDist && !dead) {
    ctx.fillStyle = 'rgba(200, 200, 255, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, sightDist, langle - sightAngle, langle + sightAngle);
    ctx.lineTo(0, 0);
    ctx.fill();
  }
  //peng body
  ctx.fillStyle = !dead ? 'black' : 'grey';
  ctx.beginPath();
  ctx.arc(0, 0, rad, 0, 2 * Math.PI);
  ctx.fill();
  //peng beak
  if (!dead) {
    ctx.rotate(langle);
    if (punchCounter > 0) {
      ctx.fillRect(0, 0, armLength, rad);
    }
    ctx.fillStyle = beakColor;
    ctx.beginPath();
    ctx.moveTo(rad, rad / 2);
    ctx.lineTo(rad * 1.3, 0);
    ctx.lineTo(rad, -rad / 2);
    ctx.fill();
  }
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
    ctx.translate(width / 2 - player.x, height / 2 - player.y);
    drawPeng(player, 'yellow', ctx);
    penguins.forEach(penguin => {
      drawPeng(penguin, 'orange', ctx);
    });
    ctx.restore();
  }
}
