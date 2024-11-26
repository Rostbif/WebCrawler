const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { start } = require("repl");
const url = require("url");

// start the timer
console.time("Execution Time");

// Getting the arguments (url + depth) from the Command line
const [, , startUrl, maxDepth] = process.argv;

// If arguments weren't provided correctly, throw an error
if (!startUrl || !maxDepth || maxDepth < 0) {
  console.error(
    "Usage should be:  node crawler.js <url> <depth>; depth should be >= 0"
  );
  process.exit(1);
}

const results = [];
const visited = new Set();

// A recursive function to crawl URL and its subpages
async function crawl(pageUrl, depth) {
  // The recursion base case
  // Check that we didn't reach the max depth, and that we havn't visited that site already
  if (depth > maxDepth || visited.has(pageUrl)) return;

  // Sign that url as visited
  visited.add(pageUrl);

  try {
    // Using axios to fetch the HTML content of the page
    const { data } = await axios.get(pageUrl);

    // Using cheerio to parse the HTML and extract image URLs.
    const $ = cheerio.load(data);

    // Iterate over each <img> element in the page
    $("img").each((_, img) => {
      // getting the src attribute of the <img> tag which usually contain the url of the image
      const imageUrl = $(img).attr("src");

      // If we have the image url then we can save this image into the results array
      if (imageUrl) {
        results.push({
          // The absolute URL of the image
          imageUrl: url.resolve(pageUrl, imageUrl),
          // The page url this image was found on
          sourceUrl: pageUrl,
          // The depth of the source at which this image was found on
          depth: depth,
        });
      }
    });

    // Checking if the current depth of the crawl is less than the depth provided by the user
    if (depth < maxDepth) {
      const links = [];

      // Iterate over any <a> tag in the page to find all links we should continue crawling
      $("a").each((_, a) => {
        // Getting the href attribute which contain the url of the link
        const link = $(a).attr("href");

        // If we have the url
        if (link) {
          // The absolute URL of the link
          links.push(url.resolve(pageUrl, link));
        }
      });

      await Promise.all(links.map((link) => crawl(link, depth + 1)));
    }
  } catch (error) {
    console.error(`Failed to crawl ${pageUrl}: ${error.message}`);
  }
}

// Immediately invoke function to start the crawling
async function startCrawling() {
  try {
    // Starting the crawling from index 0 (which means the given URL)
    await crawl(startUrl, 0);
    // Writing the results into the JSON file
    fs.writeFileSync(
      "resultsParallel.json",
      JSON.stringify({ results }, null, 2)
    );
    console.log("Crawling completed. Results were saved to results.json file!");
  } catch (error) {
    console.error(`An error occured during writing to the file: ${error}`);
  } finally {
    console.timeEnd("Execution Time");
  }
}

startCrawling();
