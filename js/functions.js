const getAngle = (dy, dx) => {
  const a = Math.atan2(dy, dx);
  return a < 0 ? a + Math.PI * 2 : a;
};

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
      if (a.isPlayer) {
        b.suspicion = Math.min(1, b.suspicion + 0.02);
        b.langle = getAngle(dy, dx);
      }
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

export const canSee = (a, b, rocks) => {
  const tooPie = Math.PI * 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const pangle = getAngle(dy, dx);
  const langle = (a.langle % tooPie + tooPie) % tooPie;
  const absDiff = Math.abs(pangle - langle);

  return (
    dist < a.sightDist &&
    (absDiff < a.sightAngle || absDiff > 2 * Math.PI - a.sightAngle) &&
    !obstructed(
      a,
      b,
      rocks.filter(rock => Math.hypot(a.x - rock.x, a.y - rock.y) < dist)
    )
  );
};

export const movePenguin = (penguin, player, rocks, deadPengs) => {
  const {
    dead,
    x,
    y,
    sightDist,
    suspicionRate,
    suspicionDecrement,
    turnAngle,
    speed
  } = penguin;
  if (dead) return;
  let moving = true;
  const seenDead = deadPengs.find(peng => canSee(penguin, peng, rocks));

  if (seenDead) {
    if (penguin.suspicion < 1 - suspicionRate)
      penguin.suspicion += suspicionRate;
    if (penguin.suspicion < 0.25) {
      penguin.langle = getAngle(seenDead.y - y, seenDead.x - x);
      moving = false;
    }
  }

  if (canSee(penguin, player, rocks)) {
    if (penguin.suspicion < 1 - suspicionRate)
      penguin.suspicion += suspicionRate;
    const dx = player.x - x;
    const dy = player.y - y;
    const dist = Math.hypot(dx, dy);
    if (penguin.suspicion > 0.25) {
      penguin.langle = getAngle(dy, dx);
      moving = dist > sightDist - 100 || penguin.suspicion >= 0.5;
    }
    if (penguin.suspicion > 0.9 && dist <= player.rad + penguin.rad + 1)
      player.dead = true;
  } else {
    if (penguin.suspicion > suspicionDecrement && !seenDead)
      penguin.suspicion -= suspicionDecrement;
    penguin.langle += turnAngle;
    if (isHitting(player, penguin)) {
      penguin.dead = true;
    }
  }
  if (!penguin.dead && moving) {
    penguin.x += speed * Math.cos(penguin.langle);
    penguin.y += speed * Math.sin(penguin.langle);
  }
};

export const movePlayer = (player, pressing) => {
  player.px = player.x;
  player.py = player.y;
  let moveX = 0;
  let moveY = 0;
  if (pressing.a || pressing.ArrowLeft) moveX--;
  if (pressing.s || pressing.ArrowDown) moveY++;
  if (pressing.d || pressing.ArrowRight) moveX++;
  if (pressing.w || pressing.ArrowUp) moveY--;
  if (pressing.f && player.punchCounter < -player.punchDelay) {
    player.punchCounter = player.punchingDuration;
  }
  if (moveX || moveY) {
    const m = player.speed / Math.hypot(moveX, moveY);
    player.x += moveX * m;
    player.y += moveY * m;
    player.langle = Math.atan2(moveY, moveX);
  }
  player.punchCounter--;
};

export const createWall = (c1, c2, rad) => {
  const res = [];
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const len = Math.hypot(dx, dy);
  const num = Math.ceil(len / (rad * 2));
  for (let i = 0; i < num; i++) {
    const lineDist = i / num;
    res[i] = {
      x: c1.x + lineDist * dx,
      y: c1.y + lineDist * dy,
      rad,
      isStationary: true,
      length: len,
      number: num
    };
  }
  return res;
};
