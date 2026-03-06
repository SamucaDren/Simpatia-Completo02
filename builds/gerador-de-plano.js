const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// raiz do projeto
const root = path.resolve(__dirname, "..");

// pasta build do projeto
const srcBuild = path.join(root, "gerador_de_plano_de_estudo", "dist");

// pasta de destino
const dest = path.join(root, "simpatia", "gerador-de-plano");

// 1. Build do projeto
console.log("Rodando build do gerador_de_plano_de_estudo...");
execSync("npm run build", {
  cwd: path.join(root, "gerador_de_plano_de_estudo"),
  stdio: "inherit",
});

// 2. Limpa pasta de destino
if (fs.existsSync(dest)) {
  console.log("Apagando pasta antiga...");
  fs.rmSync(dest, { recursive: true, force: true });
}

// 3. Cria pasta de destino
fs.mkdirSync(dest, { recursive: true });

// 4. Copia todos os arquivos da build
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

console.log("Build do gerador_de_plano_de_estudo copiada com sucesso!");
