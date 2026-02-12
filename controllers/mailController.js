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

    // Leer el logo y convertirlo a base64
    const fs = require("fs");
    const logoPath = path.join(__dirname, "../public/images/logo-boletos.png");
    let logoBase64 = "";
    try {
      logoBase64 = fs.readFileSync(logoPath).toString("base64");
    } catch (err) {
      console.error("Error al leer el logo:", err.message);
    }

    const html = selectedTemplate({ ...data, logoBase64 });

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
      subject: `Tu pasaje está confirmado - ${data.reservaCodigo || "boletos.la"}`,
      text: `Hola ${data.pasajeroNombre || "Pasajero/a"}, tu compra fue exitosa. Adjunto encontrarás tu pasaje en formato PDF. ¡Gracias por viajar con boletos.la!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; width: 100%;">
          
          <div style="margin-bottom: 24px;">
            <img 
              src="cid:logo" 
              alt="boletos.la" 
              style="max-width: 140px; height: auto;"
              onerror="this.style.display='none'"
            >
          </div>
          
          <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px 0; color: #333;">
            Hola ${data.pasajeroNombre || "Pasajero/a"},
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px 0; color: #333;">
            Tu compra se realizó con éxito. 🚌✨
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px 0; color: #333;">
            Adjuntamos tu pasaje electrónico en formato PDF.
          </p>
          
          <table style="width: 100%; margin-bottom: 24px;">
            <tr>
              <td style="background-color: #f5f7fa; padding: 16px; border-radius: 4px;">
                <p style="font-size: 14px; line-height: 1.5; margin: 0 0 8px 0; color: #555;">
                  <span style="font-weight: 600;">Código de reserva:</span> 
                  <span style="color: #ff6700; font-weight: 600;">${data.reservaCodigo || "N/A"}</span>
                </p>
                <p style="font-size: 14px; line-height: 1.5; margin: 0; color: #555;">
                  Podés presentar el pasaje en tu dispositivo móvil o impreso.<br>
                  No olvides llevar tu documento de identidad.
                </p>
              </td>
            </tr>
          </table>
          
          <p style="font-size: 15px; line-height: 1.5; margin: 0 0 8px 0; color: #333;">
            Gracias por elegir <span style="color: #ff6700; font-weight: 600;">boletos.la</span>.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eaeef2; margin: 32px 0 24px 0;">
          
          <div style="font-size: 12px; color: #7b8a9b; line-height: 1.5;">
            <p style="margin: 0 0 4px 0;">
              © ${new Date().getFullYear()} boletos.la - Todos los derechos reservados
            </p>
            <p style="margin: 0; font-size: 11px;">
              Este es un email automático, por favor no responder.
            </p>
          </div>
          
        </div>
      `,
      attachments: [
        {
          content: pdfBuffer.toString("base64"),
          filename: `pasaje_${data.reservaCodigo || "boletos"}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
        {
          content: logoBase64,
          filename: "logo-boletos.png",
          type: "image/png",
          disposition: "inline",
          content_id: "logo",
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
      return res.status(404).json({
        error: `No se encontró el archivo de template: ${templateName}`,
      });
    }

    res.status(500).json({
      error: "Error al procesar el envío de correo",
      details: error.response?.body || error.message,
    });
  }
};
