const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// raiz do projeto
const root = path.resolve(__dirname, "..");

// pasta build do React
const srcBuild = path.join(root, "ajuda_ai", "build");

// pasta de destino
const dest = path.join(root, "simpatia", "ajuda-ai");

// 1. Build do React
console.log("Rodando build do React...");
execSync("npm run build", {
  cwd: path.join(root, "ajuda_ai"),
  stdio: "inherit",
});

// 2. Limpa pasta de destino
if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });

// 3. Cria pasta destino
fs.mkdirSync(dest, { recursive: true });

// 4. Copia arquivos
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

console.log("Build copiada com sucesso!");
