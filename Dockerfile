FROM resinci/npm-x86_64-ubuntu-node10
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

RUN npm test
RUN npm run test:visual
RUN npm run build:storybook
