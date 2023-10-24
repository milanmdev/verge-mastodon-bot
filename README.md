# verge-mastodon-bot
A Mastodon bot to post a feed of articles from The Verge - [@the_verge@mastodon.social](https://mastodon.social/@the_verge)
### NOTE: The Verge has started their own official Mastodon, located at [@verge@mastodon.social](https://mastodon.social/@verge). All followers of the account linked above (`@the_verge`) are now following the new account, courtesy of the Mastodon team. 
### This project is archived as of October 24th, 2023.

# Setup
## Docker
**NOTE:** The Docker Compose file is located at `docker-compose.example.yml` in the root directory. If you want to run the bot using Docker Compose, refer to that file.
Run the Docker container (remove the -d flag to run in the foreground)
```bash
docker run -d --env ACCESS_TOKEN=YOUR_ACCESS_TOKEN INSTANCE_URL=https://your-instance.url --name verge-mastodon-bot ghcr.io/milanmdev/verge-mastodon-bot
```
## Manual
1. Clone the repository
```bash
git clone github.com/milanmdev/verge-mastodon-bot
```
2. Install the dependencies
```bash
yarn install
```
3. Create a `.env` file in the root directory of the project and add the following environment variables:
```env
ACCESS_TOKEN=token
INSTANCE_URL=https://your-instance.url
FETCH_URL=https://www.theverge.com/rss/index.xml
FETCH_INTERVAL=5
NODE_ENV=production
```
4. Run the bot
```bash
yarn start
```
