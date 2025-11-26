export type Traj = [number[], number[], number[]];

function linspace(start: number, end: number, num: number): number[] {
  const step = (end - start) / (num - 1);
  return Array.from({ length: num }, (_, i) => start + i * step);
}

function interpolate(xs: number[], ys: number[], x: number): number {
  for (let i = 0; i < xs.length - 1; i++) {
    if (x >= xs[i] && x <= xs[i + 1]) {
      const t = (x - xs[i]) / (xs[i + 1] - xs[i]);
      return ys[i] + t * (ys[i + 1] - ys[i]);
    }
  }
  return ys[ys.length - 1];
}

export function smoothTrajectory(traj: Traj, samples: number): Traj {
  const [T, X, Y] = traj;
  if (T.length < 2) return traj;

  const tt = linspace(T[0], T[T.length - 1], samples + 1);
  const xx = tt.map((t) => interpolate(T, X, t)).slice(1);
  const yy = tt.map((t) => interpolate(T, Y, t)).slice(1);

  return [tt.slice(1), xx, yy];
}
