const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const modulo_name = "Ajuda IA";
const dir_projeto = "ajuda-ai";
const out_diretory = "build";
const build_comand = "npm run build";

// raiz do projeto
const root = path.resolve(__dirname, "..");

// pasta build do projeto
const srcBuild = path.join(root, dir_projeto, out_diretory);

// pasta de destino
const dest = path.join(root, "simpatia_", "sites", dir_projeto);

// 1. Build do site
console.log("Rodando build do site-principal...");
execSync(build_comand, {
  cwd: path.join(root, dir_projeto),
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

console.log(
  `✅ Build do ${modulo_name} copiada com sucesso para simpatia_/sites/${dir_projeto}!`,
);
