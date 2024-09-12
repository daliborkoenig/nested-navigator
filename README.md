# nested-navigator

[![npm version](https://img.shields.io/npm/v/nested-navigator.svg)](https://www.npmjs.com/package/nested-navigator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, type-safe utility for effortlessly navigating and querying deeply nested objects and arrays in JavaScript and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Advanced Usage](#advanced-usage)
- [API](#api)
  - [navigator(obj)](#navigatorobj)
  - [navigateTo(path)](#navigatetopath)
  - [find(key, value, operation?)](#findkey-value-operation)
  - [filter(key, value, operation?)](#filterkey-value-operation)
  - [getIndex(keyOrValue, value?, operation?)](#getindexkeyorvalue-value-operation)
  - [getLength()](#getlength)
  - [value()](#value)
- [Comparison Operations](#comparison-operations)
- [Examples](#examples)
- [TypeScript Support](#typescript-support)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install nested-navigator using npm:

```bash
npm install nested-navigator
```

Or using yarn:

```bash
yarn add nested-navigator
```

## Usage

### Basic Usage

```javascript
import { navigator } from "nested-navigator";

const data = {
  user: {
    name: "John Doe",
    address: {
      city: "New York",
    },
    hobbies: ["reading", "coding"],
  },
};

const city = navigator(data).navigateTo("user.address.city").value();

console.log(city); // Outputs: 'New York'

const hobbiesCount = navigator(data).navigateTo("user.hobbies").getLength();

console.log(hobbiesCount); // Outputs: 2
```

### Advanced Usage

```javascript
const users = [
  { id: 1, name: "Alice", age: 30, skills: ["JavaScript", "React"] },
  { id: 2, name: "Bob", age: 25, skills: ["Python", "Django"] },
];

const olderThan25 = navigator(users)
  .filter("age", 25, "greater_than")
  .value();

console.log(olderThan25); // Outputs: [{ id: 1, name: "Alice", age: 30, skills: ["JavaScript", "React"] }]

const bobsFirstSkill = navigator(users)
  .find("name", "Bob")
  .navigateTo("skills.0")
  .value();

console.log(bobsFirstSkill); // Outputs: 'Python'

const aliceIndex = navigator(users).getIndex("name", "Alice");

console.log(aliceIndex); // Outputs: 0
```

## API

### navigator(obj)

Creates a new NestedNavigator instance.

- `obj`: The object to navigate.

Returns: A new NestedNavigator instance.

### navigateTo(path)

Navigates to a nested property specified by the given key path.

- `path`: A string representing the path to the desired property, using dot notation for nested properties.

Returns: A new NestedNavigator instance positioned at the specified nested location.

### find(key, value, operation?)

Finds an element in the current array based on a key-value pair and an optional comparison operation.

- `key`: The key to search on.
- `value`: The value to search for.
- `operation`: (Optional) The comparison operation to use. Defaults to "equals".

Returns: A new NestedNavigator instance with the found array element.

### filter(key, value, operation?)

Filters elements in the current array based on a key-value pair and an optional comparison operation.

- `key`: The key to filter on.
- `value`: The value to filter for.
- `operation`: (Optional) The comparison operation to use. Defaults to "equals".

Returns: A new NestedNavigator instance with an array of matching elements.

### getIndex(keyOrValue, value?, operation?)

Finds the index of an element in the current array based on a key-value pair (for arrays of objects) or a direct value (for arrays of primitives).

- `keyOrValue`: For arrays of objects, this is the key to search on. For arrays of primitives, this is the value to search for.
- `value`: (Optional) For arrays of objects, this is the value to search for. This parameter is not used for arrays of primitives.
- `operation`: (Optional) The comparison operation to use. Defaults to "equals".

Returns: The index of the found element, or -1 if not found.

### getLength()

Returns the length of the current array if it's an array, or undefined otherwise.

Returns: The length of the array (number) if the current value is an array, or undefined if it's not an array.

### value()

Returns the current value in the navigation.

Returns: The current value, or undefined if the navigation led to an invalid path.

## Comparison Operations

The following comparison operations are available for `find`, `filter`, and `getIndex` methods:

- `"equals"` (default): Checks if values are strictly equal.
- `"not_equals"`: Checks if values are not strictly equal.
- `"greater_than"`: Checks if the first value is greater than the second.
- `"less_than"`: Checks if the first value is less than the second.
- `"greater_than_or_equal"`: Checks if the first value is greater than or equal to the second.
- `"less_than_or_equal"`: Checks if the first value is less than or equal to the second.

Note: Numerical operations (`"greater_than"`, `"less_than"`, `"greater_than_or_equal"`, `"less_than_or_equal"`) are only performed if both values are numbers.

## Examples

### Navigating through nested objects

```javascript
const data = {
  user: {
    profile: {
      name: "John Doe",
      age: 30,
    },
  },
};

const age = navigator(data).navigateTo("user.profile.age").value();

console.log(age); // Outputs: 30
```

### Working with arrays and comparison operations

```javascript
const data = {
  users: [
    { id: 1, name: "Alice", age: 28 },
    { id: 2, name: "Bob", age: 32 },
    { id: 3, name: "Charlie", age: 22 },
  ],
};

// Finding users older than 25
const olderThan25 = navigator(data)
  .navigateTo("users")
  .filter("age", 25, "greater_than")
  .value();

console.log(olderThan25);
// Outputs: [
//   { id: 1, name: "Alice", age: 28 },
//   { id: 2, name: "Bob", age: 32 }
// ]

// Finding the first user not named "Bob"
const notBob = navigator(data)
  .navigateTo("users")
  .find("name", "Bob", "not_equals")
  .value();

console.log(notBob); // Outputs: { id: 1, name: "Alice", age: 28 }

// Getting the index of the youngest user
const youngestIndex = navigator(data)
  .navigateTo("users")
  .getIndex("age", undefined, "less_than_or_equal");

console.log(youngestIndex); // Outputs: 2 (index of Charlie)
```

## TypeScript Support

nested-navigator is written in TypeScript and provides full type safety and autocompletion when used in TypeScript projects.

```typescript
import { navigator, NestedKeyOf } from "nested-navigator";

interface User {
  name: string;
  age: number;
  address: {
    city: string;
    country: string;
  };
}

const user: User = {
  name: "John Doe",
  age: 30,
  address: {
    city: "New York",
    country: "USA",
  },
};

const path: NestedKeyOf<User> = "address.city";
const city = navigator(user).navigateTo(path).value();

console.log(city); // Outputs: 'New York'
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
