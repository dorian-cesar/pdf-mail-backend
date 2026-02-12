const html_to_pdf = require("html-pdf-node");
const { PDFDocument } = require("pdf-lib");
const path = require("path");

exports.generateTicket = async (req, res) => {
  try {
    const { templateName, ...data } = req.body;

    if (!templateName) {
      return res
        .status(400)
        .json({ error: "Debes proporcionar un templateName" });
    }

    // 1. Importar el template
    const templatePath = path.join(
      __dirname,
      "../templates",
      `${templateName}.js`,
    );
    const selectedTemplate = require(templatePath);

    // Leer el logo y convertilo a base64 (igual que en mailController)
    const fs = require("fs");
    const logoPath = path.join(__dirname, "../public/images/logo-boletos.png");
    let logoBase64 = "";
    try {
      if (fs.existsSync(logoPath)) {
        logoBase64 = fs.readFileSync(logoPath).toString("base64");
      } else {
        console.warn("Logo no encontrado en:", logoPath);
      }
    } catch (err) {
      console.error("Error al leer el logo:", err.message);
    }

    const html = selectedTemplate({ ...data, logoBase64 });

    // 2. Configuración de generación
    let options = {
      format: "A4",
      printBackground: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Sigue siendo necesario en Linux
    };

    let file = { content: html };

    // 3. Generar PDF (Retorna una Promesa con el Buffer)
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    // 4. Opcional: Metadatos con pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    pdfDoc.setTitle(`Ticket - ${data.reservaCodigo || "Sin Titulo"}`);
    const finalPdfBytes = await pdfDoc.save();

    // 5. Enviar
    res.contentType("application/pdf");
    res.send(Buffer.from(finalPdfBytes));
  } catch (error) {
    console.error("Error con html-pdf-node:", error);
    if (error.code === "MODULE_NOT_FOUND") {
      return res.status(404).json({ error: "Template no encontrado" });
    }
    res.status(500).json({ error: "Error al generar el PDF" });
  }
};
