#!/bin/bash
echo "Starting backend server..."
cd backend/server && npm start &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting frontend server..."
cd ../..
PORT=${PORT:-3000} node .output/server/index.mjs

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
