const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projeto = path.resolve(
  __dirname,
  "../oratoria"
);

const origem = path.join(projeto, "out");

const destino = path.resolve(
  __dirname,
  "../simpatia_/sites/oratoria"
);

console.log("Gerando build...");

execSync("npm run build", {
  cwd: projeto,
  stdio: "inherit",
});

console.log("Limpando destino...");

if (fs.existsSync(destino)) {
  fs.rmSync(destino, {
    recursive: true,
    force: true,
  });
}

function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source, {
    withFileTypes: true,
  });

  files.forEach((file) => {
    const sourcePath = path.join(source, file.name);
    const targetPath = path.join(target, file.name);

    if (file.isDirectory()) {
      copyFolderSync(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

console.log("Copiando arquivos...");

copyFolderSync(origem, destino);

console.log("Build publicada com sucesso!");
console.log(destino);