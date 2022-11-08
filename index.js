const FeedSub = require("feedsub");
const { login } = require("masto");
require("dotenv").config();

let launchItems = [];

let reader = new FeedSub("https://www.theverge.com/rss/index.xml", {
  interval: 10,
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
  masto.statuses.create({
    status: `${item.title} - ${item.link.href}`,
    visibility: "public",
  });
});

try {
  reader.start();
  console.log(
    `[${new Date().toUTCString()}] - [Verge RSS] Started RSS reader.`
  );
} catch (e) {
  console.log(`[${new Date().toUTCString()}] - [Verge RSS] ${e}`);
}

reader.read(async function (err, item) {
  launchItems.push(item.id);
});
