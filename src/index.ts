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
type NestedKeyOf<T> = T extends Primitive
  ? never
  : T extends Array<unknown>
  ? never
  : {
      [K in keyof T & string]:
        | K
        | (T[K] extends Primitive ? never : `${K}.${NestedKeyOf<T[K]>}`);
    }[keyof T & string];

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

type NestedValueOf<T, K extends string> = K extends keyof T
  ? T[K]
  : K extends `${infer F}.${infer R}`
  ? F extends keyof T
    ? NestedValueOf<NonNullable<T[F]>, R>
    : never
  : never;

/**
 * NestedNavigator provides a fluent interface for traversing and querying nested objects and arrays.
 * It allows for deep navigation through object properties and searching within arrays.
 *
 * The class offers methods to:
 * - Navigate to nested properties using dot notation (`navigateTo`)
 * - Find elements in arrays based on key-value pairs (`find`)
 * - Retrieve the current value at any point in the navigation (`value`)
 *
 * Usage:
 * const result = navigator(obj)
 *   .navigateTo('prop1.prop2')
 *   .find('key', 'value')
 *   .navigateTo('prop3')
 *   .value();
 *
 * If any step in the navigation process leads to undefined or null, or if a find operation
 * doesn't match any element, subsequent operations will safely return undefined.
 *
 * @template T The type of the root object being navigated
 * @template C The type of the current nested location (defaults to T)
 */

class NestedNavigator<T, C = T> {
  constructor(private obj: T, private current: C) {}

  /**
   * Navigates to a nested property specified by the given key path.
   *
   * @template K - The type of the nested key path (must be a valid nested key of C).
   * @param keyPath - The nested key path to navigate to.
   * @returns A new NestedNavigator instance positioned at the specified nested location.
   */
  navigateTo<K extends NestedKeyOf<C>>(
    keyPath: K
  ): NestedNavigator<T, NestedValueOf<C, K>> {
    const value = String(keyPath)
      .split(".")
      .reduce((o: any, k) => {
        return o && (Array.isArray(o) ? o[Number(k)] : o[k]);
      }, this.current);
    return new NestedNavigator<T, NestedValueOf<C, K>>(this.obj, value);
  }

  /**
   * Finds an element in the current array based on a key-value pair.
   *
   * @template K - The type of the key to search on (must be a key of the array element type).
   * @param key - The key to search on.
   * @param value - The value to search for.
   * @returns A new NestedNavigator instance with the found array element.
   * @throws {Error} If the current value is not an array.
   */
  find<K extends C extends any[] ? keyof C[number] : never>(
    key: K,
    value: C extends any[] ? C[number][K] : never
  ): NestedNavigator<T, C extends any[] ? C[number] : never> {
    if (!Array.isArray(this.current)) {
      throw new Error("find can only be applied to arrays");
    }
    const found = this.current.find((item) => item[key] === value);
    return new NestedNavigator<T, C extends any[] ? C[number] : never>(
      this.obj,
      found
    );
  }

  /**
   * Returns the current value in the deep navigation.
   *
   * @returns The current value, or undefined if the navigation led to an invalid path.
   */
  value(): C | undefined {
    return this.current;
  }
}

/**
 * Creates a NestedNavigator instance for the given object, enabling deep navigation and array searching.
 * This function serves as the entry point for using the NestedNavigator functionality.
 *
 * @template T The type of the object to navigate
 * @param obj The object to navigate
 * @returns A NestedNavigator instance initialized with the given object
 *  */

export function navigator<T>(obj: T): NestedNavigator<T, T> {
  return new NestedNavigator(obj, obj);
}
