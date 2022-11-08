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
  const masto = await login({
    url: "https://wuff.space",
    accessToken: process.env.ACCESS_TOKEN,
  }).then((data) => {
    console.log(
      `[${new Date().toUTCString()}] - [Mastodon] Logged in to Mastodon`
    );

    checkForArticles(data);
    setInterval(function () {
      checkForArticles();
    }, 1000 * 60 * 10);
  });
}

async function checkForArticles(mastodon) {
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

    if (itemsProcessed === array.length) return checkCallback(mastodon);
  });
}

async function checkCallback(mastodon) {
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

  await postArticles(mastodon);
}

async function postArticles(mastodon) {
  if (articlesToBePosted.length > 0) {
    console.log(
      `[${new Date().toUTCString()}] - [Mastodon] Posting ${
        articlesToBePosted.length
      } new articles...`
    );
    articlesToBePosted.forEach((item) => {
      mastodon.statuses.create({
        status: `${item.title} - ${item.link}`,
        visibility: "public",
      });
    });
    articlesToBePosted = [];
    newArticlesAmount = 0;
  }
}
