module.exports = {
    testEnvironment: "node",
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.js"],
    modulePathIgnorePatterns: [
        "src/domain/repositories/",
        "src/infrastructure/migrations/",
        "src/infrastructure/db",
        "src/infrastructure/routes",
        "src/infrastructure/seeds/",
        "src/infrastructure/persistence/"
    ],
};
