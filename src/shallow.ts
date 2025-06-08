const hasOwn = Object.prototype.hasOwnProperty;

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
