import {transmute as transmuteObject} from "../object/deep";
import type {PropertyKeyPath, DeepMerge, DeepOmitMany} from "../object/deep/types";

export function transmute<
  T extends object,
  R extends readonly PropertyKeyPath[],
  U extends object,
>(
  array: T[], 
  fieldsToRemove: R, 
  fieldsToAdd: U | ((item: T, index: number) => U)
): DeepMerge<DeepOmitMany<T, R>, U>[] {
  if (typeof fieldsToAdd === 'function') {
    for (let i = 0; i < array.length; i++) {
      transmuteObject(array[i]!, fieldsToRemove, fieldsToAdd(array[i]!, i));
    }
  } else {
    for (let i = 0; i < array.length; i++) {
      transmuteObject(array[i]!, fieldsToRemove, fieldsToAdd);
    }
  }
  return array as DeepMerge<DeepOmitMany<T, R>, U>[];
}
