#!/bin/sh
set -e

# Exit if docker isn't running
docker version > /dev/null || exit 1

container_name="rendition-screenshot"

echo "Starting Docker container"
set +e
# remove container if it already exists - e.g. tests were interrupted
docker rm -f $container_name
set -e
docker run --restart always --name $container_name -dit buildkite/puppeteer:v1.8.0 || exit 1

echo "Copying Rendition files to Docker container"
docker cp . $container_name:app

echo "Installing project dependencies and generating screenshots"
set +e
docker exec $container_name bin/bash -c "cd /app && rm -r node_modules && npm install && npm run test:visual && npm cache clean --force"
set -e

echo "Copying visual testing report to host filesystem"
docker cp $container_name:/app/.reg/ .

echo "Stopping and removing Docker container"
docker stop $container_name
docker rm $container_name

echo "Complete! A report can be found in .reg/report.html"
