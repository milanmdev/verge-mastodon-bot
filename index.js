const { login } = require("masto");
const fs = require("fs");
const Parser = require("rss-parser");
const parser = new Parser();
require("dotenv").config();

var rawArticles;
if (!fs.existsSync("./articles.json")) {
  var rawArticles = JSON.stringify({ data: [] });
  fs.writeFileSync("./articles.json", rawArticles);
} else {
  var rawArticles = fs.readFileSync("./articles.json");
}
let checkFromFile = JSON.parse(rawArticles);
let checkedArticles = [];
checkFromFile.data.forEach((data) => {
  checkedArticles.push(data);
});

let articlesToBePosted = [];
let newArticlesAmount = 0;

main().catch((e) => {
  throw e;
});
async function main() {
  console.log(
    `[${new Date().toUTCString()}] - [Mastodon] Logged in to Mastodon`
  );

  checkForArticles();
  setInterval(function () {
    checkForArticles();
  }, 1000 * 60 * 10);
}

async function checkForArticles() {
  let itemsProcessed = 0;
  console.log(
    `[${new Date().toUTCString()}] - [Verge RSS] Checking for new articles...`
  );
  let feed = await parser.parseURL("https://www.theverge.com/rss/index.xml");

  feed.items.forEach((item, index, array) => {
    itemsProcessed++;

    if (!checkedArticles.includes(item.id)) {
      newArticlesAmount++;
      articlesToBePosted.push(item);
      checkedArticles.push(item.id);
    }

    if (itemsProcessed === array.length) return checkCallback();
  });
}

async function checkCallback() {
  console.log(
    `[${new Date().toUTCString()}] - [Verge RSS] Done checking for new articles. Next update will be in 10 minutes.`
  );

  if (checkedArticles.length > 6) {
    checkedArticles = checkedArticles.slice(
      0 + newArticlesAmount,
      6 + newArticlesAmount
    );
  }
  newArticlesAmount = 0;

  let data = JSON.stringify({ data: checkedArticles });
  fs.writeFileSync("./articles.json", data);

  await postArticles();
}

async function postArticles() {
  if (articlesToBePosted.length > 0) {
    console.log(
      `[${new Date().toUTCString()}] - [Mastodon] Posting ${
        articlesToBePosted.length
      } new articles...`
    );

    const masto = await login({
      url: "https://wuff.space",
      accessToken: process.env.ACCESS_TOKEN,
    });
    articlesToBePosted.forEach((item) => {
      masto.statuses.create({
        status: `${item.title} - ${item.link}`,
        visibility: "public",
      });
    });
    articlesToBePosted = [];
    newArticlesAmount = 0;
  }
}
