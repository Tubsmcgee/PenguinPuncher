import {Penguin} from './Penguin.js';

class Norm extends Penguin {
  constructor(opts) {
    super(opts);
    this.speed = 0.75;
    this.sightDist = 300;
    this.sightAngle = Math.PI / 3.5;
    (this.rad = 20), (this.suspicion = 0);
    this.suspicionRate = 0.002;
    this.suspicionDecrement = 0.002;
    this.turnAngle = 0.01;
  }
}

class Speedy extends Penguin {
  constructor(opts) {
    super(opts);
    this.speed = 2;
    this.sightDist = 275;
    this.sightAngle = Math.PI / 5;
    this.rad = 18;
    this.suspicion = 0;
    this.suspicionRate = 0.001;
    this.suspicionDecrement = 0.002;
    this.turnAngle = 0.007;
  }
}
class Einstein extends Penguin {
  constructor(opts) {
    super(opts);
    this.speed = 0.5;
    this.sightDist = 215;
    this.sightAngle = Math.PI / 5;
    this.rad = 20;
    this.suspicion = 0;
    this.suspicionRate = 0.009;
    this.suspicionDecrement = 0.001;
    this.turnAngle = 0.03;
  }
}

class Pengbomination extends Penguin {
  constructor(opts) {
    super(opts);
    this.speed = 0.5;
    this.sightDist = 215;
    this.sightAngle = Math.PI / 5;
    this.rad = 50;
    this.suspicion = 1;
    this.suspicionRate = 0;
    this.suspicionDecrement = 0;
    this.turnAngle = 0.03;
  }
}

export const PenguinTypes = [Norm, Speedy, Einstein, Pengbomination];
