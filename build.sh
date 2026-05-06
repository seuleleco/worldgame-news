#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Building Nuxt application..."
npm run build

echo "Verifying build output..."
ls -la .output/server/
