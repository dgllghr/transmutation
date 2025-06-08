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

// Deep merge utility (used for adding fields)
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

export function transmuteObjectDeep<
  T extends object,
  R extends readonly (readonly PropertyKey[])[],
  U extends object,
>(obj: T, fieldsToRemove: R, fieldsToAdd: U): DeepMerge<DeepOmitMany<T, R>, U> {
  // Remove deeply
  for (const path of fieldsToRemove) {
    let current: any = obj;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i] as PropertyKey;
      current = current?.[key];
      if (typeof current !== "object") break;
    }
    if (current && typeof current === "object") {
      const lastKey = path[path.length - 1] as PropertyKey;
      delete current[lastKey];
    }
  }

  // Add deeply
  function deepAssign(target: any, source: any) {
    for (const key of Object.keys(source)) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        typeof target[key] === "object"
      ) {
        deepAssign(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }

  deepAssign(obj, fieldsToAdd);

  return obj as DeepMerge<DeepOmitMany<T, R>, U>;
}
