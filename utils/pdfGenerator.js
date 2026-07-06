/**
 * pdfGenerator.js
 * Utilidad para generar PDFs usando Puppeteer directamente,
 * apuntando al Chromium del sistema en entornos AWS/Linux.
 *
 * Usa una instancia persistente del browser para evitar el costo de
 * lanzar/cerrar Chromium en cada petición (más rápido y estable).
 */

const fs = require("fs");

// Usa puppeteer instalado como dependencia directa
const puppeteer = require("puppeteer");

function buildLaunchOptions() {
  // El binario real /usr/lib/chromium/chromium requiere estas vars del wrapper
  const env = {
    ...process.env,
    CHROME_WRAPPER: "/usr/bin/chromium",
    CHROME_DESKTOP: "chromium.desktop",
    CHROME_VERSION_EXTRA: "built on Debian GNU/Linux 12 (bookworm)",
  };
  // Quitar DBUS inválido que PM2 puede inyectar
  delete env.DBUS_SESSION_BUS_ADDRESS;

  const opts = {
    headless: "new",
    pipe: true,
    timeout: 60000,
    env,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  };

  if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) {
    opts.executablePath = process.env.CHROMIUM_PATH;
    console.log(`[pdfGenerator] executablePath: ${process.env.CHROMIUM_PATH}`);
  } else {
    console.log(`[pdfGenerator] Usando Chrome descargado por puppeteer`);
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
