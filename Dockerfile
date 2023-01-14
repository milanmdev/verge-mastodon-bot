FROM node:lts

LABEL org.opencontainers.image.description "A Mastodon bot to post a feed of articles from The Verge - @verge@wuff.space"

WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
CMD yarn start