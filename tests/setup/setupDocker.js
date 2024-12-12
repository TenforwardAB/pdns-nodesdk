const { execSync } = require("child_process");

module.exports = async () => {
    console.log("Starting Docker for integration tests...");
    execSync("docker-compose -f tests/docker-compose.integration.yml up -d", { stdio: "inherit" });
};
