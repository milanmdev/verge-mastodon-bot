# verge-mastodon-bot
A Mastodon bot to post a feed of articles from The Verge - [@verge@wuff.space](https://wuff.space/@verge)

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
```bash
ACCESS_TOKEN=YOUR_ACCESS_TOKEN
INSTANCE_URL=https://your-instance.url
```
4. Run the bot
```bash
yarn start
```