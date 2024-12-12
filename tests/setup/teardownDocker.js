const { execSync } = require("child_process");

module.exports = async () => {
    console.log("Stopping Docker for integration tests...");
    execSync("docker-compose -f tests/docker-compose.integration.yml down", { stdio: "inherit" });
};
