import { NestedKeyOf, NestedValueOf } from ".";

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

export class NestedNavigator<T, C = T> {
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
