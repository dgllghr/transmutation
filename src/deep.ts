import type { DeepMerge, DeepOmitMany, PropertyKeyPath } from "./types";

export function transmuteObject<
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
