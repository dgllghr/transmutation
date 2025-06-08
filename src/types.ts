export type PropertyKeyPath = readonly PropertyKey[];

// Used for removing fields from an object type
export type DeepOmitMany<
  T,
  R extends readonly (readonly PropertyKey[])[],
> = R extends [infer Head, ...infer Tail]
  ? Head extends readonly PropertyKey[]
    ? Tail extends readonly (readonly PropertyKey[])[]
      ? DeepOmitMany<DeepOmit<T, Head>, Tail>
      : DeepOmit<T, Head>
    : T
  : T;

type DeepOmit<T, Path extends readonly PropertyKey[]> = Path extends [
  infer Head,
  ...infer Tail,
]
  ? Head extends keyof T
    ? Tail extends PropertyKey[]
      ? {
          [K in keyof T]: K extends Head ? DeepOmit<T[K], Tail> : T[K];
        }
      : never
    : T
  : T;

// Used for adding fields to an object type
export type DeepMerge<T, U> = {
  [K in keyof (T & U)]: K extends keyof U
    ? K extends keyof T
      ? T[K] extends object
        ? U[K] extends object
          ? DeepMerge<T[K], U[K]>
          : U[K]
        : U[K]
      : U[K]
    : K extends keyof T
      ? T[K]
      : never;
};
