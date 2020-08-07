FROM buildkite/puppeteer:v1.8.0
WORKDIR /app

COPY package.json ./
RUN npm install && npm cache clean --force

COPY . ./

RUN npm test
RUN npm run test:visual
RUN NODE_OPTIONS="--max-old-space-size=8192" npm run build:storybook
