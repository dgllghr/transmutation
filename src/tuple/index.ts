import type { Head, RemoveAt, Tail } from "./types";

export function augment<T extends [...any], I extends number, V>(
  tup: T,
  index: I,
  value: V,
): [...Head<T, I>, V, ...Tail<T, I>] {
  tup.splice(index, 0, value);
  return tup as unknown as [...Head<T, I>, V, ...Tail<T, I>];
}

export function prune<T extends [...any], I extends number>(
  tup: T,
  index: I,
): RemoveAt<T, I> {
  tup.splice(index, 1);
  return tup as unknown as RemoveAt<T, I>;
}
