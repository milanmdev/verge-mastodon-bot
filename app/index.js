const FeedSub = require("feedsub");
const { login } = require("masto");
const process = require("process");
require("dotenv").config();

if (!process.env.ACCESS_TOKEN) throw new Error("No access token provided.");

let fetch_url;
if (!process.env.FETCH_URL)
  fetch_url = "https://www.theverge.com/rss/index.xml";
else fetch_url = process.env.FETCH_URL;
let instance_url;
if (!process.env.INSTANCE_URL) instance_url = "https://wuff.space";
else instance_url = process.env.INSTANCE_URL;
let fetch_interval;
if (!process.env.FETCH_INTERVAL) fetch_interval = 5;
else fetch_interval = process.env.FETCH_INTERVAL;

let reader = new FeedSub(fetch_url, {
  interval: fetch_interval,
  emitOnStart: true,
});

reader.read();

reader.on("item", async (item) => {
  if (process.uptime() < 60) return;
  console.log(
    `[${new Date().toUTCString()}] - [Mastodon] Posting new article (${
      item.title
    })`
  );

  const masto = await login({
    url: instance_url,
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
    `[${new Date().toUTCString()}] - [Verge RSS] Started RSS reader. Fetching from ${fetch_url} every ${fetch_interval} minutes.`
  );
} catch (e) {
  console.log(`[${new Date().toUTCString()}] - [Verge RSS] ${e}`);
}
