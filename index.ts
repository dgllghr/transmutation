export type PropertyKeyPath = readonly PropertyKey[];

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
  R extends readonly PropertyKeyPath[],
  U extends object,
>(obj: T, fieldsToRemove: R, fieldsToAdd: U): DeepMerge<DeepOmitMany<T, R>, U> {
  // Deep delete (mutating)
  for (let i = 0; i < fieldsToRemove.length; i++) {
    const path = fieldsToRemove[i] as PropertyKeyPath;
    let parent: any = obj;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i] as PropertyKey;
      parent = parent?.[key];
      if (typeof parent !== "object" || parent === null) break;
    }
    const lastKey = path[path.length - 1] as PropertyKey;
    if (parent && typeof parent === "object") {
      delete parent[lastKey];
    }
  }

  // Deep merge (mutating)
  deepAssign(obj, fieldsToAdd);

  return obj as DeepMerge<DeepOmitMany<T, R>, U>;
}

const hasOwn = Object.prototype.hasOwnProperty;

function deepAssign(target: any, source: any): void {
  if (typeof source !== "object" || source === null) return;

  const stack: Array<{ t: any; s: any }> = [{ t: target, s: source }];

  while (stack.length > 0) {
    const { t, s } = stack.pop()!;

    for (const key in s) {
      if (!hasOwn.call(s, key)) continue;

      const sourceVal = s[key];
      const targetVal = t[key];

      if (
        typeof sourceVal === "object" &&
        sourceVal !== null &&
        typeof targetVal === "object" &&
        targetVal !== null
      ) {
        stack.push({ t: targetVal, s: sourceVal });
      } else {
        t[key] = sourceVal;
      }
    }
  }
}
