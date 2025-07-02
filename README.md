# Transmutation

Type-safe object and tuple mutations.

## Installation

```bash
bun add @dgllghr/transmutation      # bun
pnpm install @dgllghr/transmutation # pnpm
npm install @dgllghr/transmutation  # npm
yarn add @dgllghr/transmutation     # yarn
```

## Why?

TODO

## Getting Started

Add a property to your object with automatic type safety.

```typescript
import {augment} from "@dgllghr/transmutation/object/shallow";

interface User {
  id: number;
  email: string;
  name?: string;
}

const user: User = {id: 42, email: "arthur.dent@gmail.com"};

// Type: User & {name: string}
// {id: 42, email: "arthur.dent@gmail.com", name: "Arthur Dent"}
const userWithName = augment(user, "name", "Arthur Dent");
console.log(userWithName.name); // No need to use null-coalescing operator
```

## Objects

Add and remove properties from an object with automatic type safety.

- **augment** - Add properties to an object.
- **prune** - Remove properties from an object.
- **transmute** - Add and remove properties from an object in one operation.

### augment
Add properties to an object.

**API**

```typescript
function augment<T extends object, U extends PropertyKey, V>(
  obj: T,
  field: U,
  value: V,
): T & { [K in U]: V }
```

**Example**

```typescript
import {augment} from "@dgllghr/transmutation/object/shallow";

interface User {
  id: number;
  email: string;
  name?: string;
}

const user: User = {id: 42, email: "arthur.dent@gmail.com"};

// Type: User & {name: string}
// {id: 42, email: "arthur.dent@gmail.com", name: "Arthur Dent"}
const userWithName = augment(user, "name", "Arthur Dent");
```

### prune
Remove properties from an object.

**API**

```typescript
function prune<T extends object, K extends keyof T>(
  obj: T,
  field: K,
): Omit<T, K>
```

**Example**

```typescript
import {prune} from "@dgllghr/transmutation/object/shallow";

interface User {
  id: number;
  email: string;
  name?: string;
}

const user: User = {id: 42, email: "arthur.dent@gmail.com"};

// Type: Omit<User, "email">
// {id: 42}
const userWithoutEmail = prune(user, "email");
```

### transmute
Add and remove properties from an object in one operation.

**API**

```typescript
function transmute<
  T extends object,
  K extends readonly (keyof T)[],
  U extends object,
>(obj: T, fieldsToRemove: K, fieldsToAdd: U): Omit<T, K[number]> & U
```

**Example**

```typescript
import {transmute} from "@dgllghr/transmutation/object/shallow";

interface User {
  id: number;
  email: string;
  name?: string;
}

const user: User = {id: 42, email: "arthur.dent@gmail.com"};

// Type: Omit<User, "email"> & {name: string}
// {id: 42, name: "Arthur Dent"}
const transformed = transmute(user, ["email"], {name: "Arthur Dent"});
```

### Deep Mutations

TODO

## Tuples

Add or remove values in a tuple with automatic type safety.

- **append** - Add a value to the end of the tuple.
- **prepend** - Add a value to the beginning of the tuple.
- **augment** - Add a value to the tuple at the provided index.
- **prune** - Remove a value from the tuple.
- **transmute** - Remove multiple values from the tuple and add values to the end.

### append
Add a value to the end of the tuple.

**API**

```typescript
function append<T extends [...any], V>(
  tup: T,
  value: V,
): Append<T, V>
```

**Example**

```typescript
import {append} from "@dgllghr/transmutation/tuple";

const birthday = [10, 3] as [number, number]; // [month, day]

// Type: [number, number, number]
// [10, 3, 1991]
const withYear = append(birthday, 1991);
```

### prepend
Add a value to the beginning of the tuple.

**API**

```typescript
function prepend<T extends [...any], V>(
  tup: T,
  value: V,
): Prepend<T, V>
```

**Example**

```typescript
import {prepend} from "@dgllghr/transmutation/tuple";

const birthday = [10, 3] as [number, number]; // [month, day]

// Type: [number, number, number]
// [1991, 10, 3]
const withYearFirst = prepend(birthday, 1991);
```

### augment
Add a value to the tuple at the provided index.

**API**

```typescript
function augment<T extends [...any], I extends number, V>(
  tup: T,
  index: I,
  value: V,
): [...Head<T, I>, V, ...Tail<T, I>]
```

**Example**

```typescript
import {augment} from "@dgllghr/transmutation/tuple";

const birthday = [10, 3] as [number, number]; // [month, day]

// Type: [number, number, number]
// [10, 1991, 3]
const withYearInMiddle = augment(birthday, 1, 1991);
```

### prune
Remove a value from the tuple.

**API**

```typescript
function prune<T extends [...any], I extends number>(
  tup: T,
  index: I,
): RemoveAt<T, I>
```

**Example**

```typescript
import {prune} from "@dgllghr/transmutation/tuple";

const birthday = [10, 3] as [number, number]; // [month, day]

// Type: [number]
// [10]
const monthOnly = prune(birthday, 1);
```

### transmute
Remove multiple values from the tuple and add values to the end.

**API**

```typescript
function transmute<
  T extends [...any],
  Indices extends readonly number[],
  Values extends readonly any[]
>(
  tup: T,
  indicesToRemove: Indices,
  valuesToAdd: Values,
): [...T, ...Values]
```

**Example**

```typescript
import {transmute} from "@dgllghr/transmutation/tuple";

const birthday = [10, 3] as [number, number]; // [month, day]

// Type: [number]
// [1991]
const transformed = transmute(birthday, [0, 1], [1991]);
```