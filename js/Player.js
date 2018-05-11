import {Character} from './Character.js';

export class Player extends Character {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.rad = 25;
    this.langle = 0;
    this.punchCounter = 0;
    this.punchingDuration = 25;
    this.punchDelay = 85;
    this.armLength = 50;
    this.dead = false;
    this.speed = 2;
    this.isPlayer = true;
  }
  move(pressing) {
    this.px = this.x;
    this.py = this.y;
    let moveX = 0;
    let moveY = 0;
    if (pressing.a || pressing.ArrowLeft) moveX--;
    if (pressing.s || pressing.ArrowDown) moveY++;
    if (pressing.d || pressing.ArrowRight) moveX++;
    if (pressing.w || pressing.ArrowUp) moveY--;
    if (pressing.f && this.punchCounter < -this.punchDelay) {
      this.punchCounter = this.punchingDuration;
    }
    if (moveX || moveY) {
      const m = this.speed / Math.hypot(moveX, moveY);
      this.x += moveX * m;
      this.y += moveY * m;
      this.langle = Math.atan2(moveY, moveX);
    }
    this.punchCounter--;
  }
  isHitting(penguin) {
    if (this.punchCounter <= 0) return false;
    const fistDist = Math.hypot(this.armLength, this.rad / 2);
    const fistAngle = Math.atan2(this.rad / 2, this.armLength) + this.langle;
    const fistX = Math.cos(fistAngle) * fistDist + this.x;
    const fistY = Math.sin(fistAngle) * fistDist + this.y;
    return Math.hypot(fistX - penguin.x, fistY - penguin.y) < penguin.rad;
  }
}
