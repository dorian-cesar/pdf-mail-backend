const modernTicket = (data) => `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { margin:0; padding:0; box-sizing:border-box; }

@page {
  size: A4;
  margin: 10mm;
}

body {
  font-family:'Inter',sans-serif;
  font-size:10.5px;
  color:#1a2332;
  background:#fff;
  padding:0;
}

.ticket-container {
  display:flex;
  flex-direction:column;
  width:100%;
}

.header {
  background:#1a2332;
  color:#fff;
  padding:12px 20px;
  border-radius:10px;
  text-align:center;
  margin-bottom:8px;
}

.company-logo {
  max-width:150px;
}

.ticket-type {
  font-size:9px;
  font-weight:600;
  margin-top:3px;
  text-transform:uppercase;
  letter-spacing:1px;
}

.route-section {
  background:#f8fafc;
  border:1.5px solid #e2e8f0;
  border-radius:8px;
  padding:14px 20px;
  margin-bottom:8px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.route-point { flex:1; text-align:center; }

.location-name {
  font-size:18px;
  font-weight:700;
  color:#ff6700;
}

.route-connector {
  width:60px;
  height:2px;
  background:#94a3b8;
}

.date-hour {
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
  margin-top:3px;
}

.details-container {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:8px;
  margin-bottom:8px;
}

.details-card {
  border:1px solid #e2e8f0;
  border-radius:8px;
  padding:10px 14px;
}

.detail-row {
  display:flex;
  justify-content:space-between;
  margin-bottom:4px;
}

.detail-row:last-child {
  margin-bottom:0;
}

.ticket-code {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1.5px dashed #0ea5e9;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  margin-bottom: 8px;
}

.ticket-code-label {
  font-size: 9px;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
  font-weight: 600;
}

.ticket-code-value {
  font-size: 18px;
  font-weight: 800;
  color: #ff6700;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
}

.payment-section {
  border:1.5px solid #e2e8f0;
  border-radius:8px;
  padding:10px 14px;
  margin-bottom:8px;
}

.total-row {
  display:flex;
  justify-content:space-between;
  background:#1a2332;
  color:#fff;
  padding:10px 14px;
  border-radius:6px;
  margin-top:6px;
  font-weight:600;
}

.total-value { color:#ff6700; font-weight:800; font-size:13px; }

.qr { text-align:center; margin-bottom:6px; }
.qr img { width:95px; height:95px; }

.footer-note {
  font-size:8.5px;
  text-align:center;
  margin-top:4px;
  line-height:1.25;
  color:#475569;
}

.company-info {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-top:10px;
  padding-top:8px;
  border-top:1px solid #e2e8f0;
  font-size:8.5px;
  color:#64748b;
}

.footer-logo { max-width:90px; }
</style>
</head>

<body>
<div class="ticket-container">

<!-- HEADER -->
<div class="header">
  <img src="data:image/png;base64,${data.logoBase64}" class="company-logo">
  <div class="ticket-type">BOLETO ELECTRÓNICO</div>
</div>

<!-- FACTURA -->
<div class="details-card" style="margin-bottom:8px;">
  <div class="detail-row"><span>Empresa:</span><span>La Santaniana S.A.</span></div>
  <div class="detail-row"><span>RUC:</span><span>80012667-0</span></div>
  <div class="detail-row"><span>Dirección:</span><span>María Auxiliadora 874 esq. Rca Argentina</span></div>
  <div class="detail-row"><span>Factura:</span><span>${data.numeroFactura}</span></div>
  <div class="detail-row"><span>Timbrado:</span><span>${data.timbrado || ""}</span></div>
</div>

<!-- RUTA -->
<div class="route-section">
  <div class="route-point">
    <div class="location-label">Origen</div>
    <div class="location-name">${data.origen}</div>
    <div class="date-hour">
      <div>${data.fechaViaje}</div>
      <div>${data.horaSalida} hrs</div>
    </div>
  </div>
  
  <div class="route-connector"></div>
  
  <div class="route-point">
    <div class="location-label">Destino</div>
    <div class="location-name">${data.destino}</div>
    <div class="date-hour">
      <div>${data.fechaViaje}</div>
      <div>${data.horaLlegada} hrs</div>
    </div>
  </div>
</div>

<!-- DETAILS -->
<div class="details-container">

<div class="details-card">
  <div class="detail-row"><span>Duración:</span><span>${data.duracion}</span></div>
  <div class="detail-row"><span>Asiento:</span><span>${data.asiento}</span></div>
  <div class="detail-row"><span>Servicio:</span><span>${data.servicio}</span></div>
  <div class="detail-row"><span>Catering:</span><span>Menú a bordo</span></div>
</div>

<div class="details-card">
  <div class="detail-row"><span>Nombre:</span><span>${data.pasajeroNombre}</span></div>
  <div class="detail-row"><span>Documento:</span><span>${data.documento}</span></div>
  <div class="detail-row"><span>Email:</span><span>${data.email}</span></div>
  <div class="detail-row"><span>Fecha Nac.:</span><span>${data.fechaNacimiento}</span></div>
</div>

</div>

<!-- TICKET NUMBER -->
<div class="ticket-code">
  <div class="ticket-code-label">Número de Boleto</div>
  <div class="ticket-code-value">${data.reservaCodigo}</div>
</div>

<!-- PAGO -->
<div class="payment-section">
  <div class="detail-row"><span>Condición:</span><span>ELECTRÓNICO</span></div>
  <div class="detail-row"><span>Fecha Venta:</span><span>${data.fechaVenta}</span></div>

  <div class="total-row">
    <span>TOTAL</span>
    <span class="total-value">${data.total}</span>
  </div>
</div>

<!-- QR -->
<div class="qr">
  <img src="data:image/png;base64,${data.qrBase64}" />
</div>

<!-- LEGAL COMPLETO -->
<div class="footer-note">
  Consulte la Validez de esta Factura Electrónica con el Número de CDC en:<br/>
  <strong>https://ekuatia.set.gov.py/consultas/${(data.cdc || "").replace(/^https?:\/\/ekuatia\.set\.gov\.py\/consultas\/?/, "")}</strong><br/>
  ESTE DOCUMENTO ES UNA REPRESENTACION GRAFICA DE UN DOCUMENTO ELECTRONICO ( XML )<br/>
  Por Disposición de la SET, en el Decreto 312/18 a los comprobantes innominados ( SIN NOMBRE ), no se les permite realizar Notas de Crédito, por lo que sugerimos mencionar el Número de CI o RUC.<br/>
  PASADAS LAS 72 hs, NO SE ACEPTARAN RECLAMOS - Ejemplar Original
</div>

<!-- FOOTER ORIGINAL -->
<div class="company-info">
  <img src="data:image/png;base64,${data.logoPartnerBase64}" alt="boletos.la" class="footer-logo">
  <div>Boleto generado electrónicamente - ${new Date().toLocaleDateString("es-ES")}</div>
  <div>Boletos.la © ${new Date().getFullYear()}</div>
</div>

</div>
</body>
</html>
`;

module.exports = modernTicket;
