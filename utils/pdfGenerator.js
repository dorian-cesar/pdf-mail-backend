/**
 * pdfGenerator.js
 * Genera PDFs llamando a la API local/remota de Gotenberg corriendo en Docker.
 * Esto evita el uso de Puppeteer directo y elimina el consumo excesivo de RAM.
 */

const FormData = require("form-data");
const http = require("http");

// Configuración de Gotenberg (se puede sobrescribir por .env en producción)
const GOTENBERG_HOST = process.env.GOTENBERG_HOST || "127.0.0.1";
const GOTENBERG_PORT = process.env.GOTENBERG_PORT || "3001"; // Usaremos el 3001 para no chocar con el puerto 3000 de Node

/**
 * Genera un PDF a partir de un string HTML haciendo una petición POST a Gotenberg.
 * @param {string} html - Contenido HTML a convertir
 * @param {object} [pdfOptions] - Opciones de renderizado (A4 por defecto)
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
async function generatePdfFromHtml(html, pdfOptions = {}) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    
    // Gotenberg requiere que el archivo HTML se llame 'index.html'
    form.append("files", Buffer.from(html), {
      filename: "index.html",
      contentType: "text/html",
    });

    // Parámetros de formato estándar (A4 con fondos habilitados)
    form.append("paperWidth", "8.27");  // 210mm en pulgadas (A4)
    form.append("paperHeight", "11.7"); // 297mm en pulgadas (A4)
    form.append("marginTop", "0");
    form.append("marginBottom", "0");
    form.append("marginLeft", "0");
    form.append("marginRight", "0");
    form.append("printBackground", "true");

    const request = http.request(
      {
        method: "POST",
        host: GOTENBERG_HOST,
        port: GOTENBERG_PORT,
        path: "/forms/chromium/convert/html",
        headers: form.getHeaders(),
      },
      (response) => {
        if (response.statusCode !== 200) {
          return reject(
            new Error(`Gotenberg devolvió código de error: ${response.statusCode}`)
          );
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
      }
    );

    request.on("error", (err) => {
      reject(
        new Error(
          `No se pudo conectar con Gotenberg en http://${GOTENBERG_HOST}:${GOTENBERG_PORT}. ¿Está corriendo Docker? Detalles: ${err.message}`
        )
      );
    });

    form.pipe(request);
  });
}

module.exports = { generatePdfFromHtml };
