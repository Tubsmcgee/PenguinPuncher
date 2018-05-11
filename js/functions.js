export const getAngle = (dy, dx) => {
  const a = Math.atan2(dy, dx);
  return a < 0 ? a + Math.PI * 2 : a;
};

export const collideFix = (objects, rocks) => {
  for (let i = 0; i < objects.length; i++) {
    for (let x = 0; x < rocks.length; x++) {
      objects[i].overlapFix(rocks[x]);
    }
    for (let j = i + 1; j < objects.length; j++) {
      objects[i].overlapFix(objects[j]);
    }
  }
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
