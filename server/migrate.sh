#!/bin/bash
# Migration script for MySQL database

# Navigate to server directory
cd "$(dirname "$0")"

# Run the migration
echo "Running database migration..."
npx ts-node ./migrations/run-migrations.ts up

# Check if migration was successful
if [ $? -eq 0 ]; then
  echo "Migration completed successfully!"
else
  echo "Migration failed. See error messages above."
  exit 1
fi
