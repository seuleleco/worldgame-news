#!/bin/bash
echo "Starting backend server..."
node backend/server/rss/server.js &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting frontend server..."
PORT=${PORT:-3000} node .output/server/index.mjs

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
