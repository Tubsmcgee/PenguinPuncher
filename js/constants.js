export const penguinTypes = [
  {
    name: 'norm',
    speed: 0.75,
    sightDist: 300,
    sightAngle: Math.PI / 3.5,
    rad: 20,
    suspicion: 0,
    suspicionRate: 0.002,
    suspicionDecrement: 0.002,
    turnAngle: 0.01
  },
  {
    name: 'speedy',
    speed: 2,
    sightDist: 275,
    sightAngle: Math.PI / 5,
    rad: 18,
    suspicion: 0,
    suspicionRate: 0.001,
    suspicionDecrement: 0.002,
    turnAngle: 0.007
  },
  {
    name: 'einstein',
    speed: 0.5,
    sightDist: 215,
    sightAngle: Math.PI / 5,
    rad: 20,
    suspicion: 0,
    suspicionRate: 0.009,
    suspicionDecrement: 0.001,
    turnAngle: 0.03
  },
  {
    name: 'pengbomination',
    speed: 0.5,
    sightDist: 215,
    sightAngle: Math.PI / 5,
    rad: 50,
    suspicion: 1,
    suspicionRate: 0,
    suspicionDecrement: 0,
    turnAngle: 0.03
  }
];
