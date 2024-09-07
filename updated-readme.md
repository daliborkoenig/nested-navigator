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
  - [filter(key, value)](#filterkey-value)
  - [getIndex(keyOrValue, value?)](#getindexkeyorvalue-value)
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
```

### Advanced Usage

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

### filter(key, value)

Filters elements in the current array based on a key-value pair.

- `key`: The key to filter on.
- `value`: The value to filter for.

Returns: A new NestedNavigator instance with an array of matching elements.

### getIndex(keyOrValue, value?)

Finds the index of an element in the current array based on a key-value pair (for arrays of objects) or a direct value (for arrays of primitives).

- `keyOrValue`: For arrays of objects, this is the key to search on. For arrays of primitives, this is the value to search for.
- `value`: (Optional) For arrays of objects, this is the value to search for. This parameter is not used for arrays of primitives.

Returns: The index of the found element, or -1 if not found.

### value()

Returns the current value in the navigation.

Returns: The current value, or undefined if the navigation led to an invalid path.

## Examples

### Filtering arrays

```javascript
const data = {
  users: [
    { id: 1, name: "Alice", role: "admin" },
    { id: 2, name: "Bob", role: "user" },
    { id: 3, name: "Charlie", role: "admin" },
  ],
};

const admins = navigator(data)
  .navigateTo("users")
  .filter("role", "admin")
  .value();

console.log(admins);
// Outputs: [
//   { id: 1, name: "Alice", role: "admin" },
//   { id: 3, name: "Charlie", role: "admin" }
// ]
```

[... rest of the README remains unchanged ...]

