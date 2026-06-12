import fs from "fs";
import FEATURES from "../src/data/atualizacoesData.js";
import MODULOS_DATA from "../src/data/modulosData.js";

const baseUrl = "https://simpatia.unifenas.br";

// pega rotas fixas
const urlsFixas = ["", "/sobre/", "/professor/", "/aluno/"];

// features
const urlsFeatures = FEATURES.map((item) => `/recurso/${item.slug}/`);

const urlsModulos = Object.values(MODULOS_DATA)
  .flat()
  .map((item) => item.link)
  .filter(Boolean);

const urls = [...urlsFixas, ...urlsFeatures, ...urlsModulos];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${baseUrl}${url.startsWith("/") ? url : "/" + url}</loc>
  </url>`,
  )
  .join("")}
</urlset>`;

fs.writeFileSync("./public/sitemap.xml", sitemap);

console.log("Sitemap gerado com sucesso!");
