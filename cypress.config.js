const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");

const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");

const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

const fs = require("fs");
const path = require("path");

async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  // Get latest downloaded file
  on("task", {
    getLatestDownloadedFile(ext) {
      const downloadsFolder = path.join(
        __dirname,
        "cypress/downloads"
      );

      return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 20;

        const check = () => {
          attempts++;

          if (!fs.existsSync(downloadsFolder)) {
            if (attempts < maxAttempts) {
              setTimeout(check, 500);
            } else {
              resolve(null);
            }
            return;
          }

          const files = fs.readdirSync(downloadsFolder)
            .filter((f) => ext ? f.endsWith(ext) : true);

          if (files.length) {
            const latest = files
              .map((file) => ({
                name: file,
                time: fs.statSync(
                  path.join(downloadsFolder, file)
                ).mtime.getTime(),
              }))
              .sort((a, b) => b.time - a.time)[0].name;
            resolve(path.join(downloadsFolder, latest));
          } else if (attempts < maxAttempts) {
            setTimeout(check, 500);
          } else {
            resolve(null);
          }
        };

        check();
      });
    },

  });

  // Log screenshot information
  on("after:screenshot", (details) => {
    console.log("Screenshot created:", details.path);
  });

  return config;
}

module.exports = defineConfig({
  projectId: "rrx4i7",

  reporter: "mochawesome",

  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: false,
    json: true,
    embeddedScreenshots: true,
  },

  // Capture screenshot automatically when a test fails
  screenshotOnRunFailure: true,

  expose: {
    baseUrl:
      "https://develop.d1vg8wvg97d1gx.amplifyapp.com/",
  },

  retries: {
    // runMode: 2,
    // openMode: 2
  },

  defaultCommandTimeout: 10000,
  pageLoadTimeout: 120000,
  requestTimeout: 30000,
  responseTimeout: 30000,
  execTimeout: 10000,

  // Increase because file download may take time
  taskTimeout: 30000,

  e2e: {
    specPattern: "**/*.feature",

    downloadsFolder: "cypress/downloads",

    setupNodeEvents,

  },
});
