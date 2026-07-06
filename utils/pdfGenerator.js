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
  // 1. Si hay variable de entorno explícita y existe en disco, usarla
  if (process.env.CHROMIUM_PATH) {
    if (fs.existsSync(process.env.CHROMIUM_PATH)) {
      console.log(`[pdfGenerator] Usando CHROMIUM_PATH: ${process.env.CHROMIUM_PATH}`);
      return process.env.CHROMIUM_PATH;
    } else {
      console.warn(
        `[pdfGenerator] CHROMIUM_PATH="${process.env.CHROMIUM_PATH}" no encontrado en disco, buscando alternativas...`
      );
    }
  }

  // 2. Usar el Chromium bundled de puppeteer (SIEMPRE compatible con su versión de CDP)
  try {
    const ep = puppeteer.executablePath();
    if (ep && fs.existsSync(ep)) {
      console.log(`[pdfGenerator] Usando Chromium bundled de puppeteer: ${ep}`);
      return ep;
    }
  } catch (e) {
    console.warn("[pdfGenerator] No se pudo obtener executablePath de puppeteer:", e.message);
  }

  // 3. Último recurso: rutas del sistema (puede ser incompatible si fue actualizado)
  const systemPaths = [
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/snap/bin/chromium",
  ];
  for (const p of systemPaths) {
    if (fs.existsSync(p)) {
      console.warn(`[pdfGenerator] ⚠️  Usando Chromium del sistema (puede ser incompatible): ${p}`);
      return p;
    }
  }

  console.warn("[pdfGenerator] No se encontró ningún ejecutable de Chromium.");
  return undefined;
}

function buildLaunchOptions() {
  const opts = {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--disable-extensions",
    ],
  };
  const executablePath = getChromiumPath();
  if (executablePath) {
    opts.executablePath = executablePath;
    console.log(`[pdfGenerator] executablePath configurado: ${executablePath}`);
  }
  return opts;
}

// Instancia única del browser (se reutiliza entre peticiones)
let browserInstance = null;

async function getBrowser() {
  if (browserInstance) {
    try {
      // Verificar que sigue vivo llamando pages()
      const pages = await browserInstance.pages();
      if (Array.isArray(pages)) return browserInstance;
    } catch {
      // Browser crashed o fue cerrado, lo relanzamos
      console.warn("[pdfGenerator] Browser en estado inválido, relanzando...");
      browserInstance = null;
    }
  }

  const launchOptions = buildLaunchOptions();
  console.log("[pdfGenerator] Lanzando Chromium...");
  browserInstance = await puppeteer.launch(launchOptions);

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
    // Navegar a about:blank primero evita que Chromium trate el contenido
    // como text/plain (bug en versiones recientes donde setContent renderiza CSS como texto)
    await page.goto("about:blank", { waitUntil: "domcontentloaded" });

    // Usar document.write fuerza el content-type text/html correctamente
    await page.evaluate((htmlContent) => {
      document.open("text/html", "replace");
      document.write(htmlContent);
      document.close();
    }, html);

    // Esperar a que la red esté quieta (imágenes base64, fuentes, etc.)
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 30000 }).catch(() => {
      // Si falla el networkIdle (ej. fuentes de Google no cargan), continuar igual
    });

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
