#!/bin/sh

# Exit if docker isn't running
docker version > /dev/null || exit 1

echo "Starting Docker container"
docker run --name rendition-screenshot -dit buildkite/puppeteer:v1.8.0 || exit 1

echo "Copying Rendition files to Docker container"
docker cp . rendition-screenshot:app

echo "Installing project dependencies and generating screenshots"
docker exec rendition-screenshot bin/bash -c "cd /app && npm ci && npm run ci:screenshot"

echo "Copying generated screenshots to host filesystem"
docker cp rendition-screenshot:/app/__screenshots__ .

echo "Stopping and removing Docker container"
docker stop rendition-screenshot
docker rm rendition-screenshot

echo "Complete!"
