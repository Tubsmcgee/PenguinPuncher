'use strict';

const MeterWidth = 40;
const MeterHeight = 5;
const MeterDist = 5;
const MeterColors = ['green', 'yellow', 'orange', 'red'];

const drawPeng = (
  {
    rad,
    langle,
    punchCounter,
    armLength,
    dead,
    x,
    y,
    sightDist,
    sightAngle
    // ray
  },
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
  //draw ray
  // if (ray) {
  //   ctx.strokeStyle = 'green';
  //   ctx.beginPath();
  //   ctx.moveTo(x, y);
  //   ctx.lineTo(ray.x, ray.y);
  //   ctx.stroke();
  // }
};

export class Renderer {
  constructor({canvas, width, height, backgroundImage}) {
    this.canvas = canvas
      .attr({width, height})
      .css({backgroundImage: `url(${backgroundImage})`});
    this.width = width;
    this.height = height;
  }
  render({penguins, player, rocks, gameWon, gameLost, level}) {
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
    //Rocks
    ctx.fillStyle = 'grey';
    ctx.beginPath();
    rocks.forEach(rock => {
      ctx.moveTo(rock.rad + rock.x, rock.y);
      ctx.arc(rock.x, rock.y, rock.rad, 0, 2 * Math.PI);
    });
    ctx.fill();
    //draw suspicion meters
    ctx.strokeStyle = 'black';
    penguins.forEach(peng => {
      if (peng.dead) return;
      const x = peng.x - MeterWidth / 2;
      const y = peng.y - peng.rad - MeterDist - MeterHeight;
      ctx.strokeRect(x, y, MeterWidth, MeterHeight);
      ctx.fillStyle =
        MeterColors[Math.floor(peng.suspicion * MeterColors.length)];
      ctx.fillRect(x, y, peng.suspicion * MeterWidth, MeterHeight);
    });

    ctx.restore();

    //penguin alive and dead counter
    ctx.fillStyle = 'black';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(
      'Penguins Dead: ' +
        penguins.filter(peng => peng.dead).length +
        '/' +
        penguins.length,
      this.width - 5,
      5
    );
    if (gameWon || gameLost) {
      ctx.fillStyle = 'black';
      ctx.font = '72px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        gameWon ? 'Victory!!!' : 'You SUUUUCK!!!!',
        width / 2,
        height / 2
      );
      ctx.font = '24px sans-serif';
      ctx.fillText(
        gameWon
          ? `Press Enter to move to level ${level + 1}`
          : 'Press Enter To Start Over',
        width / 2,
        height * 0.75
      );
    }
  }
}
