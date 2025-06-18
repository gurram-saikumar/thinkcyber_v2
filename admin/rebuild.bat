@echo off
echo Cleaning and rebuilding admin project...

cd %~dp0

echo Killing any processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a
)

echo Deleting .next folder...
rmdir /s /q .next

echo Deleting node_modules folder...
rmdir /s /q node_modules

echo Cleaning npm cache...
npm cache clean --force

echo Reinstalling dependencies...
npm install

echo Starting development server...
npm run dev
