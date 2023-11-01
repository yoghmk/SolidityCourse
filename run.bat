@echo off
echo "Başlatılıyor..."
cd /d %~dp0
npm install --legacy-peer-deps
npm start dev