@echo off
:: Vai para a pasta do projeto
cd ajuda_ai

:: Faz o build
npm run build

:: Copia a build para a pasta de deploy relativa ao projeto
xcopy build "%~dp0\simpatia\ajuda-ai" /E /H /Y

:: Sem pause, para não travar o commit