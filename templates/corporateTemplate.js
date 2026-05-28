const fs = require("fs");
const path = require("path");

let logoDataUri = "";
try {
  const logoPath = path.join(__dirname, "../public/images/logo-pullmanbus.png");
  if (fs.existsSync(logoPath)) {
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    logoDataUri = `data:image/png;base64,${logoBase64}`;
  }
} catch (error) {
  console.error("Error al cargar el logo en corporateTemplate:", error.message);
}

/**
 * Template para el correo del formulario de Reservas Corporativas
 */
const corporateTemplate = (data) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Solicitud de Reservas Corporativas</title>
  <style>
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f6f9;
      color: #333333;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f6f9;
      padding: 40px 0;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      border: 1px solid #eef2f5;
    }
    .header {
      background-color: #0739b3;
      border-top: 6px solid #fa5e00;
      padding: 40px 40px;
      color: #ffffff;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: rgba(255, 255, 255, 0.9);
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 15px;
      color: rgba(255, 255, 255, 0.9);
    }
    .content {
      padding: 40px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0739b3;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 20px;
      border-bottom: 2px solid #f0f4f8;
      padding-bottom: 8px;
    }
    .grid-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .grid-table td {
      padding: 12px 0;
      border-bottom: 1px solid #f0f4f8;
      vertical-align: top;
    }
    .label {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      width: 35%;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value {
      font-size: 15px;
      color: #1e293b;
      font-weight: 500;
    }
    .message-box {
      background-color: #f8fafc;
      border-left: 4px solid #fa5e00;
      border-radius: 0 12px 12px 0;
      padding: 20px;
      margin-top: 10px;
    }
    .message-box p {
      margin: 0;
      font-size: 14.5px;
      line-height: 1.6;
      color: #334155;
      font-style: italic;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
    }
    .footer p {
      margin: 4px 0;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 0 10px;
        border-radius: 12px;
      }
      .content {
        padding: 25px;
      }
      .header {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div style="margin-bottom: 15px;">
          <img 
            src="cid:logo" 
            alt="Pullman Bus" 
            style="max-width: 220px; height: auto; display: inline-block;"
            onerror="this.src='${logoDataUri}'; this.onerror=null;"
          />
        </div>
        <h1>Reservas Corporativas</h1>
        <p>Nueva solicitud de contacto para Reservas Corporativas</p>
      </div>
      
      <!-- Content -->
      <div class="content">
        <div class="section-title">Datos del Solicitante</div>
        <table class="grid-table">
          <tr>
            <td class="label">Nombre</td>
            <td class="value">${data.nombre || "No proporcionado"}</td>
          </tr>
          <tr>
            <td class="label">Empresa</td>
            <td class="value"><strong>${data.empresa || "No proporcionado"}</strong></td>
          </tr>
          <tr>
            <td class="label">RUT Empresa</td>
            <td class="value">${data.rut || "No proporcionado"}</td>
          </tr>
          <tr>
            <td class="label">Cargo</td>
            <td class="value">${data.cargo || "No proporcionado"}</td>
          </tr>
          <tr>
            <td class="label">Email Corporativo</td>
            <td class="value"><a href="mailto:${data.email}" style="color: #0739b3; text-decoration: none; font-weight: 600;">${data.email || "No proporcionado"}</a></td>
          </tr>
          <tr>
            <td class="label">Teléfono</td>
            <td class="value"><a href="tel:${data.telefono}" style="color: #0739b3; text-decoration: none;">${data.telefono || "No proporcionado"}</a></td>
          </tr>
          <tr>
            <td class="label">Nº Empleados</td>
            <td class="value">${data.empleados || "No proporcionado"}</td>
          </tr>
        </table>

        ${
          data.mensaje
            ? `
        <div class="section-title">Mensaje / Requerimientos</div>
        <div class="message-box">
          <p>"${data.mensaje}"</p>
        </div>
        `
            : ""
        }
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p><strong>Pullman Bus</strong></p>
        <p>Este correo fue generado automáticamente por el formulario de Reservas Corporativas.</p>
        <p>© ${new Date().getFullYear()} Pullman Bus. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

module.exports = corporateTemplate;
