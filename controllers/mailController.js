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
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img 
              src="cid:logo" 
              alt="boletos.la" 
              style="max-width: 180px; height: auto;"
              onerror="this.style.display='none'"
            >
          </div>
          
          <h3 style="color: #ff6700; margin-bottom: 20px; font-weight: 600;">Hola ${data.pasajeroNombre || "Pasajero/a"},</h3>
          
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 15px; font-weight: 400;">
            Tu compra se realizó con éxito. 🚌✨
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 15px; font-weight: 400;">
            Adjuntamos tu pasaje electrónico.
          </p>
          
          <div style="background-color: #fff4e5; border-left: 4px solid #ff6700; padding: 15px; margin-bottom: 25px;">
            <p style="font-size: 14px; color: #333; margin: 0; font-weight: 400;">
              Podés presentarlo en tu dispositivo móvil o impreso.<br>
              No olvides llevar tu documento de identidad.
            </p>
          </div>
          
          <p style="font-size: 14px; line-height: 1.5; margin-bottom: 30px; font-weight: 500;">
            Gracias por elegir <strong style="color: #ff6700; font-weight: 700;">boletos.la</strong>.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
          
          <div style="text-align: center;">
            <p style="font-size: 12px; color: #666; margin-bottom: 5px; font-weight: 500;">
              Código de reserva: <strong style="color: #ff6700; font-weight: 700;">${data.reservaCodigo || "N/A"}</strong>
            </p>
            <p style="font-size: 11px; color: #999; margin-top: 20px; font-weight: 400;">
              © ${new Date().getFullYear()} boletos.la - Todos los derechos reservados
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
