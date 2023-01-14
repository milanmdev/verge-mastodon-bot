const FeedSub = require("feedsub");
const { login } = require("masto");
require("dotenv").config();

if (!process.env.ACCESS_TOKEN) throw new Error("No access token provided.");

let fetch_url;
if (!process.env.FETCH_URL)
  fetch_url = "https://www.theverge.com/rss/index.xml";
else fetch_url = process.env.FETCH_URL;
let fetch_interval;
if (!process.env.FETCH_INTERVAL) fetch_interval = 10;
else fetch_interval = process.env.FETCH_INTERVAL;

let launchItems = [];
let reader = new FeedSub(fetch_url, {
  interval: fetch_interval,
});

reader.on("item", async (item) => {
  if (launchItems.includes(item.id)) return;
  console.log(
    `[${new Date().toUTCString()}] - [Mastodon] Posting new article (${
      item.title
    })`
  );

  const masto = await login({
    url: "https://wuff.space",
    accessToken: process.env.ACCESS_TOKEN,
  });

  await masto.v1.statuses.create({
    status: `${item.title} - ${item.link.href}`,
    visibility: "public",
  });
});

try {
  reader.start();
  console.log(
    `[${new Date().toUTCString()}] - [Verge RSS] Started RSS reader. Fetching from ${fetch_url}`
  );
} catch (e) {
  console.log(`[${new Date().toUTCString()}] - [Verge RSS] ${e}`);
}

reader.read(async function (err, item) {
  launchItems.push(item.id);
});
