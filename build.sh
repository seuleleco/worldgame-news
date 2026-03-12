#!/bin/bash
set -e

echo "Installing Python dependencies..."
pip install -r backend/server/pydecoder/requirements.txt

echo "Installing backend dependencies..."
cd backend/server && npm install

echo "Installing frontend dependencies..."
cd ../.. && npm install

echo "Building Nuxt application..."
npm run build

echo "Verifying build output..."
ls -la .output/server/
