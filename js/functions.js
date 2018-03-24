const isHitting = (player, penguin) => {
  if (player.punchCounter <= 0) return false;
  const fistDist = Math.hypot(player.armLength, player.rad / 2);
  const fistAngle =
    Math.atan2(player.rad / 2, player.armLength) + player.langle;
  const fistX = Math.cos(fistAngle) * fistDist + player.x;
  const fistY = Math.sin(fistAngle) * fistDist + player.y;
  return Math.hypot(fistX - penguin.x, fistY - penguin.y) < penguin.rad;
};

const overlapFix = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = Math.hypot(dx, dy);
  const overlap = a.rad + b.rad - dist;
  if (overlap > 0) {
    const m = b.isStationary ? overlap / dist : overlap / 2 / dist;
    a.x += m * dx;
    a.y += m * dy;
    if (!b.isStationary) {
      b.x -= m * dx;
      b.y -= m * dy;
    }
  }
};

export const collideFix = (objects, rocks) => {
  for (let i = 0; i < objects.length; i++) {
    for (let x = 0; x < rocks.length; x++) {
      overlapFix(objects[i], rocks[x]);
    }
    for (let j = i + 1; j < objects.length; j++) {
      overlapFix(objects[i], objects[j]);
    }
  }
};

const obstructed = (penguin, player, rocks) => {
  const dx = player.x - penguin.x;
  const dy = player.y - penguin.y;
  const dist = Math.hypot(dx, dy);

  const ray = (penguin.ray = {x: penguin.x, y: penguin.y});
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
      if (
        Math.hypot(penguin.x - ray.x, penguin.y - ray.y) >=
        dist - player.rad
      ) {
        return false;
      }
    } else {
      return true;
    }
  }
};

const getAngle = (dy, dx) => {
  const a = Math.atan2(dy, dx);
  return a < 0 ? a + Math.PI * 2 : a;
};

const movementTypes = [
  (penguin, frame) => {
    const cycle = (frame / 800) % 1;
    if (cycle < 0.4) {
      penguin.x--;
      penguin.langle = Math.PI;
    } else if (cycle > 0.5 && cycle < 0.9) {
      penguin.x++;
      penguin.langle = 0;
    }
  },
  (penguin, frame) => {
    const cycle = (frame / 800) % 1;
    if (cycle < 0.4) {
      penguin.y--;
      penguin.langle = Math.PI * 3 / 2;
    } else if (cycle > 0.5 && cycle < 0.9) {
      penguin.y++;
      penguin.langle = Math.PI / 2;
    }
  }
];

export const movePenguin = (penguin, player, frame, rocks) => {
  const {
    dead,
    langle,
    x,
    y,
    sightAngle,
    sightDist,
    suspicion,
    suspicionRate,
    suspicionDecrement,
    type
  } = penguin;
  if (dead) return;
  const dx = player.x - x;
  const dy = player.y - y;
  const dist = Math.hypot(dx, dy);
  const pangle = getAngle(dy, dx);
  const absDiff = Math.abs(pangle - langle);
  if (
    dist < sightDist &&
    (absDiff < sightAngle || absDiff > 2 * Math.PI - sightAngle) &&
    !obstructed(
      penguin,
      player,
      rocks.filter(rock => Math.hypot(x - rock.x, y - rock.y) < dist)
    )
  ) {
    if (suspicion < 1 - suspicionRate) penguin.suspicion += suspicionRate;

    if (suspicion > 0.25) {
      penguin.langle = pangle;
      if (dist > sightDist - 50 || suspicion >= 0.5) {
        const M = penguin.speed / dist;
        penguin.x += dx * M;
        penguin.y += dy * M;
      }
    }
    if (suspicion > 0.9 && dist < 0.01) player.dead = true;
  } else {
    if (suspicion > suspicionDecrement) penguin.suspicion -= suspicionDecrement;
    movementTypes[type](penguin, frame);
    if (isHitting(player, penguin)) {
      penguin.dead = true;
    }
  }
};
