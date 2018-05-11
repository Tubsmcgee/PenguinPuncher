import {getAngle} from './functions.js';

export class Character {
  overlapFix(b) {
    const dx = this.x - b.x;
    const dy = this.y - b.y;
    const dist = Math.hypot(dx, dy);
    const overlap = this.rad + b.rad - dist;
    if (overlap > 0) {
      const m = b.isStationary ? overlap / dist : overlap / 2 / dist;
      this.x += m * dx;
      this.y += m * dy;
      if (!b.isStationary) {
        b.x -= m * dx;
        b.y -= m * dy;
        if (this.isPlayer) {
          b.suspicion = Math.min(1, b.suspicion + 0.02);
          b.langle = getAngle(dy, dx);
        }
      }
    }
  }
  obstructed(target, rocks) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);

    const ray = (this.ray = {x: this.x, y: this.y});
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
        if (Math.hypot(this.x - ray.x, this.y - ray.y) >= dist - target.rad) {
          return false;
        }
      } else {
        return true;
      }
    }
  }
}
