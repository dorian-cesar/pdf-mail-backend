/**
 * pdfGenerator.js
 * Utilidad para generar PDFs usando Puppeteer directamente,
 * apuntando al Chromium del sistema en entornos AWS/Linux.
 *
 * Reemplaza html-pdf-node para tener control total sobre el proceso.
 */

const path = require("path");

// Usa el puppeteer que ya viene con html-pdf-node (ya instalado)
// para no tener que instalar nada extra
let puppeteer;
try {
  puppeteer = require("html-pdf-node/node_modules/puppeteer");
} catch {
  puppeteer = require("puppeteer");
}

// Ruta al Chromium: primero la variable de entorno, luego el sistema, luego el bundled
function getChromiumPath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;

  const systemPaths = [
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ];

  const fs = require("fs");
  for (const p of systemPaths) {
    if (fs.existsSync(p)) return p;
  }

  // Fallback al bundled de puppeteer
  return undefined;
}

/**
 * Genera un PDF a partir de un string HTML.
 * @param {string} html - Contenido HTML a convertir
 * @param {object} [pdfOptions] - Opciones adicionales para page.pdf()
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
async function generatePdfFromHtml(html, pdfOptions = {}) {
  const executablePath = getChromiumPath();

  const launchOptions = {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
    ],
  };

  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  const browser = await puppeteer.launch(launchOptions);

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      ...pdfOptions,
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

module.exports = { generatePdfFromHtml };
