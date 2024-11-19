# Web Crawler CLI

This is a simple web crawler CLI built with Node.js. It crawls a given URL up to a specified depth and extracts image URLs.

## Usage

```sh
node [crawler.js](http://_vscodecontentref_/1) <url> <depth>
```

## Example

```sh
node crawler.js https://www.ynet.co.il/home/0,7340,L-8,00.html 1
```

## Dependencies

- axios
- cheerio

## Installation

```sh
npm install
```

## Output

The results are saved in `results.json` in the following format:

```json
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
