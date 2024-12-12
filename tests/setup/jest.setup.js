
// Configure global variables or utilities if needed
global.testTimeout = 30000; // Set a longer timeout for integration tests, if required
jest.setTimeout(global.testTimeout); // Apply timeout to all Jest tests

console.log("Jest environment configured for integration tests");
