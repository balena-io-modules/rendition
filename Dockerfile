FROM buildkite/puppeteer:v1.8.0
WORKDIR /app

COPY package.json ./
RUN npm install && npm cache clean --force

COPY . ./

RUN npm test
RUN npm run test:visual
RUN npm run build:storybook
