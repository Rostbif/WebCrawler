# Web Crawler CLI

This is a simple web crawler CLI built with Node.js. It crawls a given URL up to a specified depth and extracts image URLs.

## Usage

```sh
node [crawler.js](http://_vscodecontentref_/1) <url> <depth>


## Example
node [crawler.js](http://_vscodecontentref_/2) https://www.hagavish-motors.co.il/ 3

## Dependencies
axios
cheerio
Installation

## Installation
npm install

## Output
{
  "results": [
    {
      "imageUrl": "https://example.com/image.jpg",
      "sourceUrl": "https://example.com",
      "depth": 1
    }
  ]
}
```
