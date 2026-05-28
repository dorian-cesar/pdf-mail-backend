const path = require("path");
// Aseguramos la carga del .env usando ruta absoluta
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const sgMail = require("@sendgrid/mail");
const html_to_pdf = require("html-pdf-node");
const fs = require("fs");

exports.sendTicketByEmail = async (req, res) => {
  const { emailDestino, templateName, type, ...data } = req.body;

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

    const emailConfig = resolveEmailConfig(type, data);

    if (!emailConfig.apiKey) {
      throw new Error(`No existe API key configurada para el tipo: ${type}`);
    }

    sgMail.setApiKey(emailConfig.apiKey);

    // Determinar qué logo usar para el header (el enviado en el body o el del config)
    const logoFile = req.body.logo || emailConfig.logo;
    const logoPath = path.join(__dirname, "../public/images", logoFile);
    const partnerLogoPath = path.join(
      __dirname,
      "../public/images/logo-boletos.png",
    );

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

    // 🔥 SOPORTE SYNC + ASYNC
    const html = await Promise.resolve(
      selectedTemplate({ ...data, logoBase64, logoPartnerBase64 }),
    );

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

    // 3. Generar el PDF (Buffer)
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    // 4. Configurar y enviar el correo vía SendGrid
    const msg = {
      to: emailDestino,
      from: emailConfig.from,
      subject: `Tu pasaje está confirmado`,
      text: `Hola ${data.pasajeroNombre || "Pasajero/a"}, tu compra fue exitosa.`,
      html: emailConfig.html,
      attachments: [
        {
          content: pdfBuffer.toString("base64"),
          filename: emailConfig.filename,
          type: "application/pdf",
          disposition: "attachment",
        },
        {
          content: logoBase64,
          filename: emailConfig.logo,
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

// Controlador para procesar y enviar por correo las solicitudes del formulario de Reservas Corporativas
exports.sendCorporateEmail = async (req, res) => {
  const { nombre, empresa, rut, cargo, email, telefono, empleados, mensaje } =
    req.body;

  if (!nombre || !empresa || !email || !telefono || !empleados) {
    return res.status(400).json({
      error:
        "Faltan campos obligatorios: nombre, empresa, email, telefono o empleados",
    });
  }

  try {
    const corporateTemplate = require("../templates/corporateTemplate");

    // Generar el HTML del correo usando la plantilla corporativa
    const html = corporateTemplate({
      nombre,
      empresa,
      rut,
      cargo,
      email,
      telefono,
      empleados,
      mensaje,
    });

    const emailFrom =
      process.env.EMAIL_FROM_CONVENIOS || "viajes@pullmanbus.cl";

    // Usar exclusivamente SENDGRID_API_KEY_CONVENIOS
    let apiKey = (process.env.SENDGRID_API_KEY_CONVENIOS || "")
      .replace(/>+$/, "")
      .trim();

    if (!apiKey) {
      throw new Error(
        "No hay API Key configurada para el envío de correos corporativos",
      );
    }

    sgMail.setApiKey(apiKey);

    // Leer el logo de Pullman Bus para incrustarlo como adjunto en línea (CID)
    const logoPath = path.join(
      __dirname,
      "../public/images/logo-pullmanbus.png",
    );
    let logoBase64 = "";
    try {
      if (fs.existsSync(logoPath)) {
        logoBase64 = fs.readFileSync(logoPath).toString("base64");
      }
    } catch (err) {
      console.error(
        "Error al leer el logo para correo corporativo:",
        err.message,
      );
    }

    const msg = {
      to: [
        "soportecuentascorrientes@pullmanbus.cl",
        "mromero@pullmanbus.cl",
        "cpoblete@pullmanbus.cl",
        "pmellado@pullman.cl",
      ], // Destinatarios del formulario de Reservas Corporativas
      from: emailFrom,
      subject: `Nueva Solicitud de Reservas Corporativas - ${empresa}`,
      text: `Nueva solicitud corporativa de ${nombre} de la empresa ${empresa}. Teléfono: ${telefono}, Email: ${email}`,
      html: html,
      replyTo: email,
    };

    if (logoBase64) {
      msg.attachments = [
        {
          content: logoBase64,
          filename: "logo-pullmanbus.png",
          type: "image/png",
          disposition: "inline",
          content_id: "logo",
        },
      ];
    }

    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message:
        "Formulario de Reservas Corporativas procesado y enviado con éxito",
    });
  } catch (error) {
    console.error("Error en sendCorporateEmail:", error.message);
    res.status(500).json({
      error: "Error al enviar el correo del formulario corporativo",
      details: error.response?.body || error.message,
    });
  }
};

function resolveEmailConfig(type, data) {
  switch (type) {
    case "pullman":
      return {
        apiKey: process.env.SENDGRID_API_KEY_CONVENIOS,
        logo: "logo-pullmanbus.png",
        from: process.env.EMAIL_FROM_CONVENIOS,
        html: pullmanTicket(data),
        filename: `pasaje_${data.numero_ticket || "ticket"}.pdf`,
      };

    //tienen que insertar acá otro caso un ticket nuevo en un futuro
    //ejemplo:
    // case "ejemplo":
    // return {
    //   logo: "logo-ejemplo.png",
    //   from: process.env.EMAIL_FROM_EJEMPLO,
    //   html: ejemploTicket(data),
    //   filename: `pasaje_${data.reservaCodigo || "ejemplo"}.pdf`,
    // };

    default:
      return {
        apiKey: process.env.SENDGRID_API_KEY_BOLETOS,
        logo: "logo-boletos.png",
        from: process.env.EMAIL_FROM_BOLETOS,
        html: boletosTicket(data),
        filename: `pasaje_${data.reservaCodigo || "boletos"}.pdf`,
      };
  }
}

function boletosTicket(data) {
  return `
   <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; width: 100%;">
          
          <div style="margin-bottom: 24px; margin-top: 12px;">
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
  `;
}

function pullmanTicket(data) {
  return `
<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Confirmación de Pasaje - Pullman Bus</title>
    <style>
        @media only screen and (max-width:600px) {
            .container {
                width: 100% !important;
                padding: 12px !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
            }

            .ticket-padding {
                padding: 18px !important;
            }

            .badge {
                display: inline-block !important;
                padding: 10px 16px !important;
            }

            .two-col td {
                display: block !important;
                width: 100% !important;
            }
        }
    </style>
</head>

<body style="margin:0; padding:0; background-color:#f5f5f5; font-family: Arial, Helvetica, sans-serif; color:#333;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center" style="padding:24px;">
                <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation"
                    style="width:600px; max-width:600px; background-color:#f5f5f5;">
                    <tr>
                        <td style="padding:20px;">

                            <!-- Header -->
                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td align="center" style="padding:12px 0 24px;">
                                <img 
                                  src="cid:logo"
                                  alt="Pullmanbus.cl"
                                  width="140"
                                  style="display:block; max-width:140px; height:auto;"
                                  onerror="this.style.display='none'"
                                >
                              </td>
                            </tr>
                          </table>
                            <!-- Success message -->
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td align="center" style="padding:8px 0 18px;">
                                        <h1 style="font-size:20px; margin:0 0 6px; font-weight:600; color:#333;">¡Todo
                                            listo, ${data.pasajero?.nombres} ${data.pasajero?.apellidos || ""}!</h1>
                                        <p style="margin:0; font-size:14px; color:#666;">Tu pasaje fue confirmado con
                                            éxito.</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Ticket card -->
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                style="background:#ffffff; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.08); overflow:hidden;">
                                <tr>
                                    <td class="ticket-padding" style="padding:26px;">
                                        <!-- Ticket header -->
                                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td style="text-align:center; padding-bottom:14px;">
                                                    <div style="font-size:14px; font-weight:600; color:#333;">Detalle de
                                                        tu compra</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="text-align:center;">
                                                    <span class="badge"
                                                        style="display:inline-block; background:#0047ab; color:#fff; padding:10px 18px; border-radius:30px; font-weight:700; font-size:13px;">
                                                        Nº DE BOLETO: ${data.numero_ticket}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>

                                        <div style="height:18px; line-height:18px; font-size:1px;">&nbsp;</div>

                                        <!-- Details -->
                                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                            class="two-col" style="width:100%;">
                                            <tr>
                                                <td valign="top" style="padding:6px 8px; width:50%;">
                                                    <table width="100%" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td
                                                                style="font-size:11px; color:#666; font-weight:700; text-transform:uppercase; padding-bottom:6px;">
                                                                Origen</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:14px; color:#333; font-weight:600;">
                                                                ${data.ciudad_origen}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top" style="padding:6px 8px; width:50%;">
                                                    <table width="100%" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td
                                                                style="font-size:11px; color:#666; font-weight:700; text-transform:uppercase; padding-bottom:6px;">
                                                                Destino</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:14px; color:#333; font-weight:600;">
                                                                ${data.ciudad_destino}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td valign="top" style="padding:16px 8px 6px; width:50%;">
                                                    <table width="100%" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td
                                                                style="font-size:11px; color:#666; font-weight:700; text-transform:uppercase; padding-bottom:6px;">
                                                                Fecha de viaje</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:14px; color:#333; font-weight:600;">
                                                                ${data.fecha_viaje}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top" style="padding:16px 8px 6px; width:50%;">
                                                    <table width="100%" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td
                                                                style="font-size:11px; color:#666; font-weight:700; text-transform:uppercase; padding-bottom:6px;">
                                                                Hora salida</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:14px; color:#333; font-weight:600;">
                                                                ${data.hora_salida}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td valign="top" style="padding:16px 8px 0; width:50%;">
                                                    <table width="100%" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td
                                                                style="font-size:11px; color:#666; font-weight:700; text-transform:uppercase; padding-bottom:6px;">
                                                                Asiento</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:14px; color:#333; font-weight:600;">
                                                                ${data.numero_asiento}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top" style="padding:16px 8px 0; width:50%;">
                                                    <table width="100%" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td
                                                                style="font-size:11px; color:#666; font-weight:700; text-transform:uppercase; padding-bottom:6px;">
                                                                Pasajero</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:14px; color:#333; font-weight:600;">
                                                                ${data.pasajero?.nombres} ${data.pasajero?.apellidos || ""}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                    </td>
                                </tr>
                            </table>

                            <!-- Contact & footer -->
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                style="margin-top:16px;">
                                <tr>
                                    <td align="center" style="padding:18px 8px 8px;">
                                        <div style="font-size:14px; font-weight:700; color:#333; margin-bottom:10px;">
                                            ¿Necesitas ayuda?</div>
                                        <div style="font-size:13px; color:#333; margin-bottom:8px;">Tel: +56 2 3304 8632
                                            • Email: clientes@pullmanbus.cl</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding:14px 8px 28px;">
                                        <div style="font-size:11px; color:#666; line-height:1.6; text-align:center;">
                                            <strong>pullmanbus.cl</strong> · Todos los derechos reservados.
                                        </div>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
  `;
}
