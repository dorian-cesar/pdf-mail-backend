const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY_BOLETOS);

exports.sendExistingPdf = async (req, res) => {
  const { email, pdfBase64, fileName, pasajeroNombre, reservaCodigo } =
    req.body;
  console.log("Datos recibidos en el controlador:", {
    email,
    pdfBase64: pdfBase64,
  });
  // Validación básica
  if (!email || !pdfBase64) {
    return res
      .status(400)
      .json({ error: "Faltan campos obligatorios: email o pdfBase64" });
  }

  try {
    const nombreArchivo =
      fileName || `boleto-${reservaCodigo || Date.now()}.pdf`;

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM_BOLETOS,
      subject: `Confirmación de Pasaje - ${reservaCodigo || "Ticket"}`,
      text: `Hola ${pasajeroNombre}, tu pasaje ha sido confirmado. Adjunto encontrarás el PDF.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #004a99;">¡Reserva Confirmada!</h2>
          <p>Hola <strong>${pasajeroNombre || "Pasajero"}</strong>,</p>
          <p>Tu pago ha sido procesado con éxito. Adjunto a este correo encontrarás tu pasaje oficial para el viaje.</p>
          <p style="font-size: 12px; color: #777;">Código de reserva: ${reservaCodigo || "N/A"}</p>
          <br>
          <p>¡Buen viaje!</p>
        </div>
      `,
      attachments: [
        {
          content: pdfBase64, // SendGrid espera el string base64 directo
          filename: nombreArchivo,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message: `Aviso enviado con éxito a ${email}`,
    });
  } catch (error) {
    console.error("Error al enviar PDF existente:", error.message);
    res.status(500).json({
      error: "Error al enviar el correo",
      details: error.response?.body || error.message,
    });
  }
};
