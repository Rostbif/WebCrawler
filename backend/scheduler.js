const { exec } = require("child_process");
const path = require("path");
const { stdout } = require("process");

const interval = 60 * 1 * 1000;
console.log(`Starting the scheduler with ${interval} interval`);
const crawlerScript = path.join("crawler.js");

// Can change that later to get those arguments from the client
const startUrl = "https://example.com";
const maxDepth = 0;
const rateLimitDelay = 0; // Optional
let counter = 1;

function runCrawler() {
  const command = `node ${crawlerScript} ${startUrl} ${rateLimitDelay} `;
  console.log(`Running command: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing crawler: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Crawler stderr: ${stderr}`);
      return;
    }
    console.log(`Crawler stdout: ${stdout}`);
  });
}

setInterval(() => {
  console.log(`Starting the crawler for the ${counter} time...`);
  counter++;
  runCrawler();
}, interval);

//console.log(`Starting the crawler for the ${counter}...`);
//counter++;
//runCrawler();
