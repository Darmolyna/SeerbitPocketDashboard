const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

module.exports = defineConfig({
  expose: {
    baseUrl: "https://develop.d1vg8wvg97d1gx.amplifyapp.com/"
  },

  retries: {
    runMode: 2,   // Retry failed tests twice in `cypress run`
    openMode: 2
  },

  defaultCommandTimeout: 10000,      // Default: 4000ms
  pageLoadTimeout: 120000,           // Default: 60000ms
  requestTimeout: 30000,             // Default: 5000ms
  responseTimeout: 30000,            // Default: 10000ms
  execTimeout: 10000,               // cy.exec()
  taskTimeout: 10000,               // cy.task()
  e2e: {
    specPattern: "**/*.feature",
    setupNodeEvents,
  },
});