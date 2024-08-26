import { navigator, NestedKeyOf } from "nested-navigator";
import * as readline from "readline";

interface TestData {
  user: {
    name: string;
    address: {
      city: string;
      country: string;
    };
    hobbies: string[];
  };
  settings: {
    theme: "light" | "dark";
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

const testData: TestData = {
  user: {
    name: "John Doe",
    address: {
      city: "New York",
      country: "USA",
    },
    hobbies: ["reading", "coding", "traveling"],
  },
  settings: {
    theme: "dark",
    notifications: {
      email: true,
      push: false,
    },
  },
};

console.log("Test Object:");
console.log(JSON.stringify(testData, null, 2));

// Static usage example with type inference
const staticResult = navigator(testData).navigateTo("user.hobbies.1").value();
console.log("\nStatic Result (user.hobbies.1):", staticResult);
// TypeScript should infer that staticResult is of type string | undefined

// Function to navigate using user input
function navigatePath(path: string) {
  try {
    const result = navigator(testData)
      .navigateTo(path as NestedKeyOf<TestData>)
      .value();
    console.log(`\nResult for path "${path}":`);
    console.log("Value:", result);
    console.log("Type:", typeof result);
  } catch (error) {
    console.log(`\nError for path "${path}": Invalid path`);
  }
}

// Set up readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUser() {
  rl.question(
    '\nEnter a path to navigate (or "exit" to quit): ',
    (input: string) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        return;
      }
      navigatePath(input);
      promptUser();
    }
  );
}

console.log("\nTry these paths:");
console.log("- user.name");
console.log("- user.address.city");
console.log("- user.hobbies.1");
console.log("- settings.notifications.email");

promptUser();
