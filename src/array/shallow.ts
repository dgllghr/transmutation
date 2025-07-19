import {augment as augmentObject, prune as pruneObject, transmute as transmuteObject} from "../object/shallow";

export function augment<T extends object, U extends PropertyKey, V>(
  array: T[],
  field: U,
  value: V | ((item: T, index: number) => V)
): (T & { [K in U]: V })[] {
  if (typeof value === 'function') {
    for (let i = 0; i < array.length; i++) {
      augmentObject(array[i]!, field, (value as (item: T, index: number) => V)(array[i]!, i));
    }
  } else {
    for (let i = 0; i < array.length; i++) {
      augmentObject(array[i]!, field, value);
    }
  }
  return array as (T & { [K in U]: V })[];
}

export function prune<T extends object, K extends keyof T>(
  array: T[],
  field: K
): Omit<T, K>[] {
  for (let i = 0; i < array.length; i++) {
    pruneObject(array[i]!, field);
  }
  return array as Omit<T, K>[];
}

export function transmute<T extends object, K extends readonly (keyof T)[], U extends object>(
  array: T[],
  fieldsToRemove: K,
  fieldsToAdd: U | ((item: T, index: number) => U)
): (Omit<T, K[number]> & U)[] {
  if (typeof fieldsToAdd === 'function') {
    for (let i = 0; i < array.length; i++) {
      transmuteObject(array[i]!, fieldsToRemove, fieldsToAdd(array[i]!, i));
    }
  } else {
    for (let i = 0; i < array.length; i++) {
      transmuteObject(array[i]!, fieldsToRemove, fieldsToAdd);
    }
  }
  return array as unknown as (Omit<T, K[number]> & U)[];
}
