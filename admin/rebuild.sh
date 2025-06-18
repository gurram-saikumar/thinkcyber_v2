#!/bin/bash
echo "Cleaning up and rebuilding the admin project..."

# Navigate to admin directory
cd "$(dirname "$0")"

# Stop any running processes on port 3000 (this might need admin privileges)
echo "Stopping any processes on port 3000..."
# For Windows, uncomment the following:
# netstat -ano | findstr :3000 | findstr LISTENING | awk '{print $5}' | xargs -r taskkill /F /PID

# Clean up build artifacts
echo "Removing node_modules and .next..."
rm -rf node_modules/.cache
rm -rf .next

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

# Start development server
echo "Starting development server..."
npm run dev
