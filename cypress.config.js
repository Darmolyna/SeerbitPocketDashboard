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

  on("task", {
    // Get latest downloaded file
    getLatestDownloadedFile() {
      const downloadsFolder = path.join(
        config.projectRoot,
        "cypress",
        "downloads"
      );

      const maxWaitTime = 30000;
      const pollingInterval = 500;
      const startTime = Date.now();

      function findLatestFile() {
        if (!fs.existsSync(downloadsFolder)) {
          return null;
        }

        const files = fs
          .readdirSync(downloadsFolder)
          .filter(
            (file) =>
              !file.endsWith(".crdownload") &&
              !file.endsWith(".tmp") &&
              !file.startsWith(".")
          );

        if (!files.length) {
          return null;
        }

        return files
          .map((file) => ({
            name: file,
            time: fs.statSync(
              path.join(downloadsFolder, file)
            ).mtime.getTime(),
          }))
          .sort((a, b) => b.time - a.time)[0].name;
      }

      return new Promise((resolve, reject) => {
        function checkForFile() {
          const fileName = findLatestFile();

          if (fileName) {
            resolve(fileName);
            return;
          }

          if (Date.now() - startTime >= maxWaitTime) {
            reject(
              new Error(
                `No downloaded file found after ${maxWaitTime / 1000
                } seconds`
              )
            );
            return;
          }

          setTimeout(checkForFile, pollingInterval);
        }

        checkForFile();
      });
    },

    // Clear downloads folder
    clearDownloads() {
      const downloadsFolder = path.join(
        config.projectRoot,
        "cypress",
        "downloads"
      );

      if (fs.existsSync(downloadsFolder)) {
        fs.readdirSync(downloadsFolder).forEach((file) => {
          const filePath = path.join(
            downloadsFolder,
            file
          );

          fs.rmSync(filePath, {
            recursive: true,
            force: true,
          });
        });
      }

      return null;
    },
  });

  return config;
}

module.exports = defineConfig({
  projectId: "rrx4i7",

  baseUrl:
    "https://develop.d1vg8wvg97d1gx.amplifyapp.com/",

  retries: {
    runMode: 2,
    openMode: 0,
  },

  defaultCommandTimeout: 10000,

  pageLoadTimeout: 120000,

  requestTimeout: 30000,

  responseTimeout: 30000,

  execTimeout: 10000,

  taskTimeout: 30000,

  e2e: {
    specPattern: "**/*.feature",

    downloadsFolder: "cypress/downloads",

    setupNodeEvents,
  },
});