/**
 * Creates a NestedNavigator instance for the given object, enabling deep navigation and array searching.
 * This function serves as the entry point for using the NestedNavigator functionality.
 *
 * @template T The type of the object to navigate
 * @param obj The object to navigate
 * @returns A NestedNavigator instance initialized with the given object
 *  */

import { NestedNavigator } from "./NestedNavigator";

export function navigator<T>(obj: T): NestedNavigator<T, T> {
  return new NestedNavigator(obj, obj);
}
