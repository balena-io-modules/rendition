#!/bin/sh

# Exit if docker isn't running
docker version > /dev/null || exit 1

echo "Starting Docker container"
docker run --name rendition-screenshot -dit buildkite/puppeteer:v1.8.0 || exit 1

echo "Copying Rendition files to Docker container"
docker cp . rendition-screenshot:app

echo "Installing project dependencies and generating screenshots"
docker exec rendition-screenshot bin/bash -c "cd /app && npm ci && npm run test:visual"

echo "Copying visual testing report to host filesystem"
docker cp rendition-screenshot:/app/.reg/ .

echo "Stopping and removing Docker container"
docker stop rendition-screenshot
docker rm rendition-screenshot

echo "Complete! A report can be found in .reg/report.html"
