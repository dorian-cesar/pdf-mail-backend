require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const puppeteer = require("puppeteer");
const ticketTemplate = require("../templates/ticketTemplate");

console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY ? "✅" : "❌");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendTicketByEmail = async (req, res) => {
  const { emailDestino, ...data } = req.body;

  try {
    // 1. Generar el PDF en memoria (Buffer)
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
    const page = await browser.newPage();
    await page.setContent(ticketTemplate(data), { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // 2. Configurar el correo
    const msg = {
      to: emailDestino,
      from: process.env.EMAIL_FROM,
      subject: `Tu Ticket de Viaje - ${data.reservaCodigo}`,
      text: "Adjunto encontrarás tu boleto de viaje.",
      html: "<strong>Adjunto encontrarás tu boleto de viaje.</strong>",
      attachments: [
        {
          // Forzamos la conversión a string base64 limpia
          content: Buffer.from(pdfBuffer).toString("base64"),
          filename: `Ticket_${data.reservaCodigo}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    // 3. Enviar vía SendGrid
    await sgMail.send(msg);

    res
      .status(200)
      .json({ success: true, message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error SendGrid:", error.response?.body || error.message);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
};
