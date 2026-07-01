/**
 * pdfGenerator.js
 * Utilidad para generar PDFs usando Puppeteer directamente,
 * apuntando al Chromium del sistema en entornos AWS/Linux.
 *
 * Usa una instancia persistente del browser para evitar el costo de
 * lanzar/cerrar Chromium en cada petición (más rápido y estable).
 */

const fs = require("fs");

// Usa el puppeteer que ya viene con html-pdf-node (ya instalado)
let puppeteer;
try {
  puppeteer = require("html-pdf-node/node_modules/puppeteer");
} catch {
  puppeteer = require("puppeteer");
}

// Ruta al Chromium del sistema
function getChromiumPath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const systemPaths = [
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ];
  for (const p of systemPaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

const LAUNCH_OPTIONS = {
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-zygote",
  ],
};

const executablePath = getChromiumPath();
if (executablePath) LAUNCH_OPTIONS.executablePath = executablePath;

// Instancia única del browser (se reutiliza entre peticiones)
let browserInstance = null;

async function getBrowser() {
  if (browserInstance) {
    try {
      // Verificar que sigue conectado
      const pages = await browserInstance.pages();
      if (pages !== undefined) return browserInstance;
    } catch {
      // Browser crashed o fue cerrado, lo relanzamos
      browserInstance = null;
    }
  }

  console.log("[pdfGenerator] Lanzando Chromium...");
  browserInstance = await puppeteer.launch(LAUNCH_OPTIONS);

  // Si el browser se cierra inesperadamente, limpiar la referencia
  browserInstance.on("disconnected", () => {
    console.log("[pdfGenerator] Chromium desconectado, se relanzara en la proxima peticion.");
    browserInstance = null;
  });

  return browserInstance;
}

/**
 * Genera un PDF a partir de un string HTML.
 * @param {string} html - Contenido HTML a convertir
 * @param {object} [pdfOptions] - Opciones adicionales para page.pdf()
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
async function generatePdfFromHtml(html, pdfOptions = {}) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      ...pdfOptions,
    });

    return pdfBuffer;
  } finally {
    // Cerrar solo la pagina, NO el browser (se reutiliza)
    await page.close().catch(() => {});
  }
}

module.exports = { generatePdfFromHtml };
