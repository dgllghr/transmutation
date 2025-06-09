const hasOwn = Object.prototype.hasOwnProperty;

export function augmentObject<T extends object, U extends PropertyKey, V>(
  obj: T,
  field: U,
  value: V,
): T & { [K in U]: V } {
  (obj as any)[field] = value;
  return obj as T & {
    [K in U]: V;
  };
}

export function pruneObject<T extends object, K extends keyof T>(
  obj: T,
  field: K,
): Omit<T, K> {
  delete obj[field];
  return obj as Omit<T, K>;
}

export function transmuteObject<
  T extends object,
  K extends readonly (keyof T)[],
  U extends object,
>(obj: T, fieldsToRemove: K, fieldsToAdd: U): Omit<T, K[number]> & U {
  // Remove specified fields
  for (let i = 0; i < fieldsToRemove.length; i++) {
    delete obj[fieldsToRemove[i] as keyof T];
  }

  // Add new fields
  for (const key in fieldsToAdd) {
    if (hasOwn.call(fieldsToAdd, key)) {
      obj[key as unknown as keyof T] = fieldsToAdd[key] as any;
    }
  }

  return obj as unknown as Omit<T, K[number]> & U;
}
