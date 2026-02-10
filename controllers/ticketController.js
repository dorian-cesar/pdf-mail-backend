const puppeteer = require("puppeteer");
const { PDFDocument } = require("pdf-lib");
const ticketTemplate = require("../templates/ticketTemplate");

exports.generateTicket = async (req, res) => {
  try {
    const data = req.body;
    const html = ticketTemplate(data);

    // 1. Lanzar Puppeteer para renderizar el HTML
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // 2. Usar pdf-lib para procesar el buffer (opcional: añadir metadatos)
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    pdfDoc.setTitle(`Ticket de Reserva - ${data.reservaCodigo}`);
    const finalPdfBytes = await pdfDoc.save();

    // 3. Enviar respuesta
    res.contentType("application/pdf");
    res.send(Buffer.from(finalPdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar el PDF" });
  }
};
