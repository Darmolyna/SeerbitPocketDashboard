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

function xmlDecode(value) {
  return String(value)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function colLetterToIndex(letters) {
  let index = 0;
  for (const char of letters) {
    index = index * 26 + (char.charCodeAt(0) - 64);
  }
  return index;
}

function extractSharedStrings(xml) {
  const strings = [];
  const siPattern = /<si>([\s\S]*?)<\/si>/g;
  let siMatch;
  while ((siMatch = siPattern.exec(xml)) !== null) {
    let text = "";
    const tPattern = /<t(?:[^>]*)>([\s\S]*?)<\/t>/g;
    let tMatch;
    while ((tMatch = tPattern.exec(siMatch[1])) !== null) {
      text += tMatch[1];
    }
    strings.push(xmlDecode(text));
  }
  return strings;
}

function parseWorksheetXml(xml, sharedStrings) {
  const rows = [];
  const rowPattern = /<row\b[^>]*>([\s\S]*?)<\/row>/g;
  let rowMatch;
  while ((rowMatch = rowPattern.exec(xml)) !== null) {
    const cells = {};
    let maxIndex = 0;
    const cellPattern = /<c\b([^>]*)>([\s\S]*?)<\/c>/g;
    let cellMatch;
    while ((cellMatch = cellPattern.exec(rowMatch[1])) !== null) {
      const attrs = cellMatch[1] || "";
      const inner = cellMatch[2] || "";
      const refMatch = /\br="([^"]+)"/.exec(attrs);
      if (!refMatch) continue;
      const index = colLetterToIndex(refMatch[1].replace(/[0-9]/g, ""));
      const typeMatch = /\bt="([^"]+)"/.exec(attrs);
      const type = typeMatch ? typeMatch[1] : null;
      const valueMatch = /<v>([\s\S]*?)<\/v>/.exec(inner);
      let value = "";
      if (type === "s") {
        value = sharedStrings[parseInt(valueMatch ? valueMatch[1] : "-1", 10)] ?? "";
      } else if (type === "inlineStr") {
        let text = "";
        const tPattern = /<t(?:[^>]*)>([\s\S]*?)<\/t>/g;
        let tMatch;
        while ((tMatch = tPattern.exec(inner)) !== null) {
          text += tMatch[1];
        }
        value = xmlDecode(text);
      } else if (valueMatch) {
        value = xmlDecode(valueMatch[1]);
      }
      cells[index] = value;
      maxIndex = Math.max(maxIndex, index);
    }
    const rowValues = [];
    for (let i = 1; i <= maxIndex; i++) {
      rowValues.push(cells[i] ?? "");
    }
    rows.push(rowValues);
  }
  return rows;
}

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
    parsePdf(filePath) {
      const { PDFParse } = require("pdf-parse");
      const fs = require("fs");
      const data = new Uint8Array(fs.readFileSync(filePath));
      const parser = new PDFParse({ data });
      return parser.getText().then((result) => {
        parser.destroy();
        return result.text;
      });
    },

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

    parseXlsx(filePath) {
      const yauzl = require("yauzl");

      return new Promise((resolve, reject) => {
        yauzl.open(filePath, { lazyEntries: true, autoClose: true }, (err, zipfile) => {
          if (err) return reject(err);

          const parts = {};

          const readEntry = (entry) => {
            zipfile.openReadStream(entry, (readErr, stream) => {
              if (readErr) return reject(readErr);
              const chunks = [];
              stream.on("data", (chunk) => chunks.push(chunk));
              stream.on("error", reject);
              stream.on("end", () => {
                parts[entry.fileName] = Buffer.concat(chunks).toString("utf8");
                zipfile.readEntry();
              });
            });
          };

          zipfile.on("entry", (entry) => {
            if (
              /^xl\/(sharedStrings\.xml|workbook\.xml|_rels\/workbook\.xml\.rels|worksheets\/[^/]+\.xml)$/.test(
                entry.fileName
              )
            ) {
              readEntry(entry);
            } else {
              zipfile.readEntry();
            }
          });

          zipfile.on("error", reject);

          zipfile.on("end", () => {
            try {
              const sharedStrings = parts["xl/sharedStrings.xml"]
                ? extractSharedStrings(parts["xl/sharedStrings.xml"])
                : [];
              const sheetName =
                Object.keys(parts).find((name) =>
                  /^xl\/worksheets\/[^/]+\.xml$/.test(name)
                ) || null;
              if (!sheetName) {
                reject(new Error(`No worksheet found in xlsx: ${filePath}`));
                return;
              }
              resolve(parseWorksheetXml(parts[sheetName], sharedStrings));
            } catch (parseErr) {
              reject(parseErr);
            }
          });

          zipfile.readEntry();
        });
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
