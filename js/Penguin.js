import {getAngle} from './functions.js';
import {Character} from './Character.js';

export class Penguin extends Character {
  constructor({x, y, langle}) {
    super();
    this.x = x;
    this.y = y;
    this.langle = langle;
    this.dead = false;
  }
  move(player, rocks, deadPengs) {
    const {
      dead,
      x,
      y,
      sightDist,
      suspicionRate,
      suspicionDecrement,
      turnAngle,
      speed
    } = this;
    if (dead) return;
    let moving = true;
    const seenDead = deadPengs.find(peng => this.canSee(peng, rocks));

    if (seenDead) {
      if (this.suspicion < 1 - suspicionRate) this.suspicion += suspicionRate;
      if (this.suspicion < 0.25) {
        this.langle = getAngle(seenDead.y - y, seenDead.x - x);
        moving = false;
      }
    }

    if (this.canSee(player, rocks)) {
      if (this.suspicion < 1 - suspicionRate) this.suspicion += suspicionRate;
      const dx = player.x - x;
      const dy = player.y - y;
      const dist = Math.hypot(dx, dy);
      if (this.suspicion > 0.25) {
        this.langle = getAngle(dy, dx);
        moving = dist > sightDist - 100 || this.suspicion >= 0.5;
      }
      if (this.suspicion > 0.9 && dist <= player.rad + this.rad + 1)
        player.dead = true;
    } else {
      if (this.suspicion > suspicionDecrement && !seenDead)
        this.suspicion -= suspicionDecrement;
      this.langle += turnAngle;
      if (player.isHitting(this)) {
        this.dead = true;
      }
    }
    if (!this.dead && moving) {
      this.x += speed * Math.cos(this.langle);
      this.y += speed * Math.sin(this.langle);
    }
  }
  canSee(b, rocks) {
    const tooPie = Math.PI * 2;
    const dx = b.x - this.x;
    const dy = b.y - this.y;
    const dist = Math.hypot(dx, dy);
    const pangle = getAngle(dy, dx);
    const langle = (this.langle % tooPie + tooPie) % tooPie;
    const absDiff = Math.abs(pangle - langle);

    return (
      dist < this.sightDist &&
      (absDiff < this.sightAngle || absDiff > 2 * Math.PI - this.sightAngle) &&
      !this.obstructed(
        b,
        rocks.filter(
          rock => Math.hypot(this.x - rock.x, this.y - rock.y) < dist
        )
      )
    );
  }
}
