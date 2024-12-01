const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Server the results.json file
app.get("/results", (req, res) => {
  //   const crawlerScript = path.join("crawler.js");
  //   // Can change that later to get those arguments from the client
  //   const startUrl = "https://example.com";
  //   const maxDepth = 0;
  //   const rateLimitDelay = 0; // Optional
  //   const command = `node ${crawlerScript} ${startUrl} ${rateLimitDelay} `;
  //   console.log(`Running command: ${command}`);

  //   exec(command, (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`Error executing crawler: ${error.message}`);
  //       return;
  //     }
  //     if (stderr) {
  //       console.error(`Crawler stderr: ${stderr}`);
  //       return;
  //     }
  //     console.log(`Crawler stdout: ${stdout}`);
  //   });

  res.sendFile(path.join(__dirname, "results.json"));
});

app.listen(port, () => {
  {
    console.log(`Server is running at http://localhost:${port}`);
  }
});
