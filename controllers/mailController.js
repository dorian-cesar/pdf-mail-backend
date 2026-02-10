const path = require("path");
// Aseguramos la carga del .env usando ruta absoluta
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const sgMail = require("@sendgrid/mail");
const html_to_pdf = require("html-pdf-node"); // Alternativa ligera a Puppeteer directo

// Inicializamos SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendTicketByEmail = async (req, res) => {
  const { emailDestino, templateName, ...data } = req.body;

  if (!emailDestino || !templateName) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: emailDestino o templateName",
    });
  }

  try {
    // 1. Importar el template dinámicamente
    const templatePath = path.join(
      __dirname,
      "../templates",
      `${templateName}.js`,
    );
    const selectedTemplate = require(templatePath);
    const html = selectedTemplate(data);

    // 2. Configuración para la generación del PDF
    const options = {
      format: "A4",
      printBackground: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    };

    const file = { content: html };

    // 3. Generar el PDF (Buffer) de forma simplificada
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    // 4. Configurar y enviar el correo vía SendGrid
    const msg = {
      to: emailDestino,
      from: process.env.EMAIL_FROM,
      subject: `Tu Documento Confirmado - ${data.reservaCodigo || "Ticket"}`,
      text: "Adjunto encontrarás tu documento en formato PDF.",
      html: `<h3>Hola ${data.pasajeroNombre || "Pasajero"},</h3>
             <p>Gracias por tu compra. Adjunto enviamos tu ticket generado con el diseño: <strong>${templateName}</strong>.</p>`,
      attachments: [
        {
          // Convertimos el buffer a base64 limpio para SendGrid
          content: pdfBuffer.toString("base64"),
          filename: `${templateName}_${data.reservaCodigo || "doc"}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message: `Correo enviado con éxito a ${emailDestino}`,
    });
  } catch (error) {
    console.error("Error en MailController:", error.message);

    if (error.code === "MODULE_NOT_FOUND") {
      return res
        .status(404)
        .json({
          error: `No se encontró el archivo de template: ${templateName}`,
        });
    }

    res.status(500).json({
      error: "Error al procesar el envío de correo",
      details: error.response?.body || error.message,
    });
  }
};
