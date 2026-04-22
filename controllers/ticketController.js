const html_to_pdf = require("html-pdf-node");
const { PDFDocument } = require("pdf-lib");
const path = require("path");

exports.generateTicket = async (req, res) => {
  try {
    const { templateName, logo, ...data } = req.body;

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

    const allowedLogos = [
      "logo-boletos.png",
      "logo-pullmanbus.png",
      "logo-santaniana-blanco.png",
    ];

    // Leer el logo y convertirlo a base64
    const fs = require("fs");

    const logoFile = allowedLogos.includes(logo) ? logo : "logo-boletos.png";
    const logoPath = path.join(__dirname, "../public/images", logoFile);
    const partnerLogoPath = path.join(__dirname, "../public/images/logo-boletos.png");

    let logoBase64 = "";
    let logoPartnerBase64 = "";

    try {
      if (fs.existsSync(logoPath)) {
        logoBase64 = fs.readFileSync(logoPath).toString("base64");
      }
      if (fs.existsSync(partnerLogoPath)) {
        logoPartnerBase64 = fs.readFileSync(partnerLogoPath).toString("base64");
      }
    } catch (err) {
      console.error("Error al leer los logos:", err.message);
    }

    // 🔥 AQUÍ ESTÁ LA MEJORA (soporta async o sync automáticamente)
    const html = await Promise.resolve(
      selectedTemplate({ ...data, logoBase64, logoPartnerBase64 }),
    );

    // 2. Configuración de generación
    let options = {
      format: "A4",
      printBackground: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };

    let file = { content: html };

    // 3. Generar PDF
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    // 4. Metadatos
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
