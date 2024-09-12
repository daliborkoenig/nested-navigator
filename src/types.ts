/**
 * Represents primitive types in TypeScript.
 * This type is used to distinguish between primitive values and complex objects or arrays.
 */
type Primitive = string | number | boolean | null | undefined;

/**
 * A type that represents all possible nested key paths of a given type T.
 * It generates a union type of all possible dot-notated paths through the object type.
 *
 * @template T - The type to extract nested keys from.
 *
 * This type works as follows:
 * 1. If T is a Primitive, it returns 'never' (as primitives don't have nested keys).
 * 2. If T is an Array, it returns 'never' (array indices are handled separately).
 * 3. For objects, it creates a union of:
 *    - The direct keys of T
 *    - Dot-notated paths for nested non-primitive properties
 *
 * Example:
 * For type T = { a: number, b: { c: string, d: { e: boolean } } }
 * NestedKeyOf<T> = 'a' | 'b' | 'b.c' | 'b.d' | 'b.d.e'
 */
export type NestedKeyOf<
  T,
  Depth extends unknown[] = []
> = Depth["length"] extends 5 // Limit depth to 5
  ? never
  : T extends Primitive
  ? never
  : T extends any[]
  ? `${number}` | `${number}.${NestedKeyOf<T[number], [...Depth, unknown]>}`
  : T extends object
  ? {
      [K in keyof T & string]:
        | K
        | `${K}.${NestedKeyOf<T[K], [...Depth, unknown]>}`;
    }[keyof T & string]
  : never;

/**
 * A type that represents the value type at a given nested key path of type T.
 * It traverses the type T using the dot-notated path K to find the type at that path.
 *
 * @template T - The type to navigate.
 * @template K - The dot-notated string path.
 *
 * This type works as follows:
 * 1. If K is a direct key of T, it returns T[K].
 * 2. If K is a dot-notated path:
 *    - It splits the path into the first key (F) and the rest (R).
 *    - It recursively applies NestedValueOf to T[F] with the rest of the path.
 * 3. If at any point the key doesn't exist in T, it returns 'never'.
 *
 * Example:
 * For type T = { a: number, b: { c: string, d: { e: boolean } } }
 * NestedValueOf<T, 'b.d.e'> = boolean
 */

export type NestedValueOf<
  T,
  K extends string,
  Depth extends unknown[] = []
> = Depth["length"] extends 5
  ? unknown
  : K extends keyof T
  ? T[K]
  : K extends `${number}`
  ? T extends any[]
    ? T[number]
    : never
  : K extends `${infer F}.${infer R}`
  ? F extends keyof T
    ? NestedValueOf<NonNullable<T[F]>, R, [...Depth, unknown]>
    : F extends `${number}`
    ? T extends any[]
      ? NestedValueOf<T[number], R, [...Depth, unknown]>
      : never
    : never
  : never;

/**
 * Defines the types of comparison operations that can be performed.
 */
export type ComparisonOperation =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal";
