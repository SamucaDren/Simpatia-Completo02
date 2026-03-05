@echo off
:: Vai para a pasta do projeto
cd ajuda_ai

:: Faz o build
npm run build

:: Apaga tudo na pasta de destino e recria
rd "%~dp0\simpatia\ajuda-ai" /s /q
mkdir "%~dp0\simpatia\ajuda-ai"

:: Copia a build
xcopy build "%~dp0\simpatia\ajuda-ai" /E /H /Y

:: Sem pause, para não travar o commit