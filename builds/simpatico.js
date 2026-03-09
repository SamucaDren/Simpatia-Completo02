const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// raiz do projeto
const root = path.resolve(__dirname, "..");

// pasta da build
const srcBuild = path.join(root, "simpatico", "out");

// pasta destino
const dest = path.join(root, "simpatia", "simpatico");

// rodar build
console.log("Rodando build do simpatico...");
execSync("npm run build", {
  cwd: path.join(root, "simpatico"),
  stdio: "inherit",
});

// apagar destino antigo
if (fs.existsSync(dest)) {
  console.log("Apagando pasta antiga...");
  fs.rmSync(dest, { recursive: true, force: true });
}

// criar pasta destino
fs.mkdirSync(dest, { recursive: true });

// copiar arquivos
function copyFolderSync(src, dest) {
  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyFolderSync(srcBuild, dest);

console.log("Build copiada para simpatia/simpatico com sucesso!");
