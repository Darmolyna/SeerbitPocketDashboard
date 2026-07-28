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

    getLatestDownloadedFile() {

      const downloadsFolder = path.join(
        __dirname,
        "cypress/downloads"
      );

      if (!fs.existsSync(downloadsFolder)) {
        return null;
      }

      const files = fs.readdirSync(downloadsFolder);

      if (!files.length) {
        return null;
      }

      return files
        .map(file => ({
          name: file,
          time: fs.statSync(
            path.join(downloadsFolder, file)
          ).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time)[0]
        .name;

    }

  });


  return config;
}


module.exports = defineConfig({

  expose: {
    baseUrl: "https://develop.d1vg8wvg97d1gx.amplifyapp.com/"
  },


  retries: {
    runMode: 2,
    openMode: 2
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