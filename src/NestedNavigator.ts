import { ComparisonOperation, NestedKeyOf, NestedValueOf } from "./types";

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
      .reduce((acc: any, key) => {
        if (acc === undefined) return undefined;
        if (Array.isArray(acc) && /^\d+$/.test(key)) {
          return acc[parseInt(key, 10)];
        }
        return acc[key];
      }, this.current);
    return new NestedNavigator<T, NestedValueOf<C, K>>(this.obj, value);
  }

  /**
   * Compares two values based on the specified operation.
   *
   * @private
   * @param a - The first value to compare.
   * @param b - The second value to compare.
   * @param operation - The comparison operation to perform.
   * @returns A boolean indicating whether the comparison is true or false.
   */
  private compare(a: any, b: any, operation: ComparisonOperation): boolean {
    switch (operation) {
      case "equals":
        return a === b;
      case "not_equals":
        return a !== b;
      case "greater_than":
        return typeof a === "number" && typeof b === "number" && a > b;
      case "less_than":
        return typeof a === "number" && typeof b === "number" && a < b;
      case "greater_than_or_equal":
        return typeof a === "number" && typeof b === "number" && a >= b;
      case "less_than_or_equal":
        return typeof a === "number" && typeof b === "number" && a <= b;
      default:
        return false;
    }
  }

  /**
   * Finds an element in the current array based on a key-value pair and an optional comparison operation.
   *
   * @template K - The type of the key to search on (must be a key of the array element type).
   * @param key - The key to search on.
   * @param value - The value to search for.
   * @param operation - The comparison operation to use (defaults to "equals").
   * @returns A new NestedNavigator instance with the found array element, or undefined if:
   *          - The current value is not an array
   *          - No element is found matching the key-value pair and operation
   *          - The operation is numerical and the values are not numbers
   */
  find<K extends C extends any[] ? keyof C[number] : never>(
    key: K,
    value: C extends any[] ? C[number][K] | undefined : never,
    operation: ComparisonOperation = "equals"
  ): NestedNavigator<T, C extends any[] ? C[number] | undefined : undefined> {
    if (!Array.isArray(this.current)) {
      return new NestedNavigator<
        T,
        C extends any[] ? C[number] | undefined : undefined
      >(
        this.obj,
        undefined as C extends any[] ? C[number] | undefined : undefined
      );
    }

    const found = this.current.find((item) =>
      this.compare(item[key], value, operation)
    );
    return new NestedNavigator<
      T,
      C extends any[] ? C[number] | undefined : undefined
    >(this.obj, found as C extends any[] ? C[number] | undefined : undefined);
  }

  /**
   * Filters elements in the current array based on a key-value pair and an optional comparison operation.
   *
   * @template K - The type of the key to filter on (must be a key of the array element type).
   * @param key - The key to filter on.
   * @param value - The value to filter for.
   * @param operation - The comparison operation to use (defaults to "equals").
   * @returns A new NestedNavigator instance with:
   * - undefined if the current value is not an array
   * - an array of matching objects otherwise (which may be empty if no matches are found)
   */
  filter<K extends C extends any[] ? keyof C[number] : never>(
    key: K,
    value: C extends any[] ? C[number][K] : never,
    operation: ComparisonOperation = "equals"
  ): NestedNavigator<T, C extends any[] ? C[number][] : undefined> {
    if (!Array.isArray(this.current)) {
      return new NestedNavigator<T, C extends any[] ? C[number][] : undefined>(
        this.obj,
        undefined as C extends any[] ? C[number][] : undefined
      );
    }

    const found = this.current.filter((item) =>
      this.compare(item[key], value, operation)
    );
    return new NestedNavigator<T, C extends any[] ? C[number][] : undefined>(
      this.obj,
      found as C extends any[] ? C[number][] : undefined
    );
  }

  /**
   * Finds the index of an element in the current array based on a key-value pair or just a value,
   * with an optional comparison operation.
   *
   * @template K - The type of the key to search on (for object arrays) or the type of value to search for (for primitive arrays).
   * @template V - The type of the value to search for (only for object arrays).
   * @param keyOrValue - The key to search on (for object arrays) or the value to search for (for primitive arrays).
   * @param value - The value to search for (only used for object arrays).
   * @param operation - The comparison operation to use (defaults to "equals").
   * @returns The index of the found element, -1 if not found, or undefined if the current value is not an array.
   */
  getIndex<
    K extends C extends any[]
      ? C[number] extends object
        ? keyof C[number]
        : C[number]
      : never,
    V extends C extends any[]
      ? C[number] extends object
        ? C[number][K & keyof C[number]] | undefined
        : never
      : never
  >(
    keyOrValue: K,
    value?: V,
    operation: ComparisonOperation = "equals"
  ): number | undefined {
    if (!Array.isArray(this.current)) {
      return undefined;
    }

    if (typeof keyOrValue !== "object" && value === undefined) {
      return this.current.findIndex((item) =>
        this.compare(item, keyOrValue, operation)
      );
    } else {
      return this.current.findIndex((item) =>
        this.compare((item as any)[keyOrValue as string], value, operation)
      );
    }
  }

  /**
   * Returns the length of the current value if it's an array, or undefined otherwise.
   *
   * @returns The length of the array if the current value is an array, or undefined if it's not an array.
   */
  getLength(): number | undefined {
    return Array.isArray(this.current) ? this.current.length : undefined;
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
