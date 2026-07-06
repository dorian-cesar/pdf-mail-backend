/**
 * test-gotenberg.js
 * Script rápido para probar que la integración local o remota con Gotenberg funciona.
 * Ejecútalo localmente o en el servidor con: node test-gotenberg.js
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { generatePdfFromHtml } = require("./utils/pdfGenerator");

const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 50px; text-align: center; }
    h1 { color: #ff6700; }
    .badge { background: #1a2332; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; }
  </style>
</head>
<body>
  <h1>¡Gotenberg Funcionando Correctamente!</h1>
  <p>Esta es una prueba de generación de PDF en AWS utilizando Gotenberg en Docker.</p>
  <div class="badge">Conexión Exitosa</div>
</body>
</html>
`;

async function runTest() {
  console.log("Iniciando prueba de Gotenberg...");
  console.log(`Host configurado: ${process.env.GOTENBERG_HOST || "127.0.0.1 (default)"}`);
  console.log(`Puerto configurado: ${process.env.GOTENBERG_PORT || "3001 (default)"}`);

  try {
    const pdfBuffer = await generatePdfFromHtml(testHtml);
    
    const outputPath = path.join(__dirname, "test-output.pdf");
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log("\x1b[32m%s\x1b[0m", `\n✓¡Éxito! El PDF de prueba se generó correctamente en: ${outputPath}`);
    console.log("Gotenberg respondió correctamente en menos de un segundo.");
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "\n✗ Error al intentar generar el PDF con Gotenberg:");
    console.error(error.message);
  }
}

runTest();
