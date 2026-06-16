const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const modulo_name = "Corretor de Questões Descritivas";
const dir_projeto = "corretor-questoes-descritivas";
const out_diretory = "dist";
const build_comand = "npm run build";

const root = path.resolve(__dirname, "..");

const srcBuild = path.join(root, dir_projeto, out_diretory);

const dest = path.join(
  root,
  "simpatia_",
  "sites",
  dir_projeto
);

console.log("Gerando build...");

execSync(build_comand, {
  cwd: path.join(root, dir_projeto),
  stdio: "inherit",
});

if (fs.existsSync(dest)) {
  fs.rmSync(dest, {
    recursive: true,
    force: true,
  });
}

fs.mkdirSync(dest, {
  recursive: true,
});

function copyFolderSync(src, dest) {
  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, {
        recursive: true,
      });

      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyFolderSync(srcBuild, dest);

console.log("Build copiada com sucesso!");