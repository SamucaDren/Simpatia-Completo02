const fs = require("fs");
const path = require("path");

// raiz do projeto
const root = path.resolve(__dirname, "..");

// pasta origem
const src = path.join(root, "gerador_de_questoes_descritivas");

// pasta destino
const dest = path.join(root, "simpatia", "gerador-de-questoes-descritivas");

console.log("Copiando gerador_de_questoes_descritivas...");

// remove destino antigo
if (fs.existsSync(dest)) {
  console.log("Apagando pasta antiga...");
  fs.rmSync(dest, { recursive: true, force: true });
}

// recria pasta destino
fs.mkdirSync(dest, { recursive: true });

// função de cópia
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

copyFolderSync(src, dest);

console.log("Arquivos copiados com sucesso!");
