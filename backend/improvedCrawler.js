const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const url = require("url");
const robotsParser = require("robots-parser");

console.time("Execution Time");

const [, , startUrl, maxDepth, rateLimitDelay] = process.argv;

// If arguments weren't provided correctly, throw an error
// rateLimitDelay is optional
if (!startUrl || !maxDepth || maxDepth < 0) {
  console.error(
    "Usage should be:  node crawler.js <url> <depth>; depth should be >= 0"
  );
  process.exit(1);
}

const results = [];
const visited = new Set();
let robots;

// Function to fetch and parse robots.txt
async function fetchRobotsTxt(siteUrl) {
  try {
    const robotsUrl = url.resolve(siteUrl, "/robots.txt");
    const { data } = await axios.get(robotsUrl);
    robots = robotsParser(robotsUrl, data);
  } catch (error) {
    console.warn(`Failed to fetch robots.txt: ${error.message}`);
    robots = robotsParser("", ""); // Create an empty robots.txt parser
  }
}

// if rate limit delay was provided (to manage block prevention) then we use that function...
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function crawl(pageUrl, depth, retryTime = 1) {
  console.log(`Crawling ${pageUrl}, RetryTime:${retryTime}`);
  if (depth > maxDepth || visited.has(pageUrl)) return;

  // ckeck robots.txt rules
  // if (robots && !robots.isAllowed(pageUrl, "*")) {
  //   console.log(`Skipping ${pageUrl} due to robots.txt rules`);
  //   return;
  // }

  try {
    // incase a rate limit delay has been requested
    if (rateLimitDelay) {
      await delay(rateLimitDelay);
    }

    const { data } = await axios.get(pageUrl);
    const $ = cheerio.load(data);

    $("img").each((_, img) => {
      const imageUrl = $(img).attr("src");
      if (imageUrl) {
        results.push({
          imageUrl: url.resolve(pageUrl, imageUrl),
          sourceUrl: pageUrl,
          depth: depth,
        });
      }
    });

    // mark this website as visited only if I pushed his photos...
    visited.add(pageUrl);

    if (depth < maxDepth) {
      const links = [];
      $("a").each((_, a) => {
        const link = $(a).attr("href");
        if (link) {
          links.push(url.resolve(pageUrl, link));
        }
      });

      for (const link of links) {
        await crawl(link, depth + 1);
      }
    }
  } catch (error) {
    console.log(
      `Failed to crawl ${pageUrl}: ${error.message} Retry Time:${retryTime}`
    );
    // Retry mechanism
    if (retryTime < 2) {
      await crawl(pageUrl, depth, retryTime + 1);
    }
  }
}

// Immediately invoke function to start the crawling

(async () => {
  try {
    console.log(
      "Start crawling (starting from the robot.txt and then the site itself)"
    );
    await fetchRobotsTxt(startUrl);
    await crawl(startUrl, 0);
    fs.writeFileSync(
      "improvedResults.json",
      JSON.stringify({ results }, null, 2)
    );
    console.log("Crawling completed. Results were saved to results.json file!");
  } catch (error) {
    console.error(`Failed to write results to the file: ${error.message}`);
  } finally {
    console.timeEnd("Execution Time");
  }
})();
