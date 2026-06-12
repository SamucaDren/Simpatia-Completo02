const path = require("path");
const puppeteer = require("puppeteer");
const express = require("express");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { htmlContent } = req.body;

  if (!htmlContent) {
    return res.status(400).send("Conteúdo HTML não fornecido.");
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      url: `file://${path.resolve(__dirname).replace(/\\/g, "/")}/`,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="plano_de_aula.pdf"',
    );
    res.send(pdf);
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    res.status(500).send("Erro ao gerar o PDF. Por favor, tente novamente.");
  }
});

module.exports = router;
