FROM buildkite/puppeteer:v1.8.0
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

RUN npm test
RUN npm run build
RUN npm run test:visual
RUN npm run build:storybook
