export type Head<T extends any[], I extends number> = T extends [
  ...infer H,
  ...infer _R,
]
  ? H["length"] extends I
    ? H
    : Head<_R, I>
  : [];

export type Tail<T extends any[], I extends number> = T extends [
  ...infer H,
  ...infer R,
]
  ? H["length"] extends I
    ? R
    : Tail<R, I>
  : [];

export type RemoveAt<T extends any[], I extends number> = T extends [
  ...infer Head,
  infer _,
  ...infer Tail,
]
  ? Head["length"] extends I
    ? [...Head, ...Tail]
    : T extends [infer _, ...infer Rest]
      ? RemoveAt<Rest, I> extends infer R
        ? R extends any[]
          ? [T[0], ...R]
          : never
        : never
      : T
  : T;
