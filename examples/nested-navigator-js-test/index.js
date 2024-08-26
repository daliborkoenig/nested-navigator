const { navigator } = require("nested-navigator");
// @ts-ignore
const readline = require("readline");

const testData = {
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

// Static usage example
const staticResult = navigator(testData).navigateTo("user.hobbies.1").value();
console.log("\nStatic Result (user.hobbies.1):", staticResult);

// Function to navigate using user input
function navigatePath(path) {
  try {
    const result = navigator(testData).navigateTo(path).value();
    console.log(`\nResult for path "${path}":`);
    console.log("Value:", result);
    console.log("Type:", typeof result);
  } catch (error) {
    console.log(`\nError for path "${path}": Invalid path`);
  }
}

// Set up readline interface for user input
const rl = readline.createInterface({
  // @ts-ignore
  input: process.stdin,
  // @ts-ignore
  output: process.stdout,
});

function promptUser() {
  rl.question('\nEnter a path to navigate (or "exit" to quit): ', (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }
    navigatePath(input);
    promptUser();
  });
}

console.log("\nTry these paths:");
console.log("- user.name");
console.log("- user.address.city");
console.log("- user.hobbies.1");
console.log("- settings.notifications.email");

promptUser();
