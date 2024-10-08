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
  - [find(key, value)](#findkey-value)
  - [getIndex(keyOrValue, value)](#getIndexkeyOrValue-value)
  - [value()](#value)
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

## Basic Usage

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
```

## Advanced Usage

```javascript
const users = [
  { id: 1, name: "Alice", skills: ["JavaScript", "React"] },
  { id: 2, name: "Bob", skills: ["Python", "Django"] },
];

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

### find(key, value)

Finds an element in the current array based on a key-value pair.

- `key`: The key to search on.
- `value`: The value to search for.

Returns: A new NestedNavigator instance with the found array element.
Throws an error if the current value is not an array.

### getIndex(keyOrValue, value?)

Finds the index of an element in the current array based on a key-value pair (for arrays of objects) or a direct value (for arrays of primitives).

- `keyOrValue`: For arrays of objects, this is the key to search on. For arrays of primitives, this is the value to search for.
- `value`: (Optional) For arrays of objects, this is the value to search for. This parameter is not used for arrays of primitives.

Returns: The index of the found element, or -1 if not found.

Throws an error if the current value is not an array.

### value()

Returns the current value in the navigation.
Returns: The current value, or undefined if the navigation led to an invalid path.

### Examples

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

### Working with arrays

```javascript
const data = {
  users: [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ],
  tags: ["javascript", "typescript", "react"],
};

// Finding index in an array of objects
const bobIndex = navigator(data).navigateTo("users").getIndex("name", "Bob");

console.log(bobIndex); // Outputs: 1

// Finding index in an array of primitives
const reactIndex = navigator(data).navigateTo("tags").getIndex("react");

console.log(reactIndex); // Outputs: 2
```

```javascript
const data = {
  users: [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ],
};

const bob = navigator(data).navigateTo("users").find("name", "Bob").value();

console.log(bob); // Outputs: { id: 2, name: 'Bob' }

const aliceIndex = navigator(data)
  .navigateTo("users")
  .getIndex("name", "Alice");

console.log(aliceIndex); // Outputs: 0
```

### TypeScript Support

nested-navigator is written in TypeScript and provides full type safety and autocompletion when used in TypeScript projects.

```typescript
import { navigator, NestedKeyOf } from "nested-navigator";

interface Data {
  users: Array<{ id: number; name: string }>;
  tags: string[];
}

const data: Data = {
  users: [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ],
  tags: ["javascript", "typescript", "react"],
};

// Finding index in an array of objects
const bobIndex = navigator(data).navigateTo("users").getIndex("name", "Bob");

// Finding index in an array of primitives
const reactIndex = navigator(data).navigateTo("tags").getIndex("react");

console.log(bobIndex, reactIndex); // Outputs: 1 2

const path: NestedKeyOf<User> = "address.city";
const city = navigator(user).navigateTo(path).value();

console.log(city); // Outputs: 'New York'
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

### License

This project is licensed under the MIT License - see the LICENSE file for details.
