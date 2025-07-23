@echo off
:: Migration script for MySQL database

:: Navigate to server directory
cd /d "%~dp0"

:: Run the migration
echo Running database migration...
npx ts-node ./migrations/run-migrations.ts up

:: Check if migration was successful
if %ERRORLEVEL% equ 0 (
  echo Migration completed successfully!
) else (
  echo Migration failed. See error messages above.
  exit /b 1
)
