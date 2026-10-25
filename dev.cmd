@echo off
cd /d "%~dp0"
if exist "nyayasetu-poc" (
  cd nyayasetu-poc
)
npm.cmd run dev
