
export interface Point {
  x: number;
  y: number;
}

export function addPoints(a: Point, b: Point): Point {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function subtractPoints(a: Point, b: Point): Point {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(
    b.x - a.x,
    b.y - a.y,
  );
}

export function lerpPoints(
  a: Point,
  b: Point,
  t: number,
): Point {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}
