const modernTicket = (data) => `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { margin:0; padding:0; box-sizing:border-box; }

body {
  font-family:'Inter',sans-serif;
  font-size:11px;
  color:#1a2332;
  background:#fff;
  width:210mm;
  height:297mm;
  padding:15mm;
}

.ticket-container {
  display:flex;
  flex-direction:column;
  height:100%;
}

.header {
  background:#1a2332;
  color:#fff;
  padding:20px 30px;
  border-radius:12px;
  text-align:center;
  margin-bottom:20px;
}

.company-logo {
  max-width:180px;
}

.ticket-type {
  font-size:10px;
  font-weight:600;
  margin-top:5px;
  text-transform:uppercase;
}

.route-section {
  background:#f8fafc;
  border:2px solid #e2e8f0;
  border-radius:10px;
  padding:25px;
  margin-top: 20px;
  margin-bottom:20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.route-point { flex:1; text-align:center; }

.location-name {
  font-size:22px;
  font-weight:700;
  color:#ff6700;
}

.route-connector {
  width:80px;
  height:2px;
  background:#94a3b8;
}

.details-container {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:15px;
  margin-bottom:20px;
}

.details-card {
  border:1px solid #e2e8f0;
  border-radius:8px;
  padding:18px;
}

.detail-row {
  display:flex;
  justify-content:space-between;
  margin-bottom:8px;
}

.payment-section {
  border:2px solid #e2e8f0;
  border-radius:8px;
  padding:20px;
  margin-bottom:20px;
}

.total-row {
  display:flex;
  justify-content:space-between;
  background:#1a2332;
  color:#fff;
  padding:15px;
  border-radius:6px;
}

.total-value { color:#ff6700; font-weight:800; }

.qr { text-align:center; }
.qr img { width:120px; }

.footer-note {
  font-size:9px;
  text-align:center;
  margin-top:10px;
  line-height:1.3;
}

.company-info {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-top:auto;
  padding-top:15px;
  border-top:1px solid #e2e8f0;
  font-size:9px;
}

.footer-logo { max-width:110px; }
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
<div class="details-card">
  <div class="detail-row"><span>Empresa</span><span>La Santaniana S.A.</span></div>
  <div class="detail-row"><span>RUC</span><span>80012667-0</span></div>
  <div class="detail-row"><span>Dirección</span><span>María Auxiliadora 874 esq. Rca Argentina</span></div>
  <div class="detail-row"><span>Factura</span><span>${data.numeroFactura}</span></div>
</div>

<!-- RUTA -->
<div class="route-section">
  <div class="route-point">
    <div class="location-label">Origen</div>
    <div class="location-name">${data.origen}</div>
    <div class="terminal-name">${data.terminalOrigen || ""}</div>
    <div class="date-hour">
      <div>${data.fechaViaje}</div>
      <div>${data.horaSalida} hrs</div>
    </div>
  </div>
  
  <div class="route-connector"></div>
  
  <div class="route-point">
    <div class="location-label">Destino</div>
    <div class="location-name">${data.destino}</div>
    <div class="terminal-name">${data.terminalDestino || ""}</div>
    <div class="date-hour">
      <div>${data.fechaViaje}</div>
      <div>${data.horaLlegada} hrs</div>
    </div>
  </div>
</div>

<!-- DETAILS -->
<div class="details-container">

<div class="details-card">
  <div class="detail-row"><span>Duración</span><span>${data.duracion}</span></div>
  <div class="detail-row"><span>Asiento</span><span>${data.asiento}</span></div>
  <div class="detail-row"><span>Servicio</span><span>${data.servicio}</span></div>
  <div class="detail-row"><span>Catering</span><span>Menú a bordo</span></div>
</div>

<div class="details-card">
  <div class="detail-row"><span>Nombre</span><span>${data.pasajeroNombre}</span></div>
  <div class="detail-row"><span>Documento</span><span>${data.documento}</span></div>
  <div class="detail-row"><span>Email</span><span>${data.email}</span></div>
  <div class="detail-row"><span>Fecha Nac.</span><span>${data.fechaNacimiento}</span></div>
</div>

</div>

<!-- PAGO -->
<div class="payment-section">
  <div class="detail-row"><span>Condición</span><span>ELECTRÓNICO</span></div>
  <div class="detail-row"><span>Fecha Venta</span><span>${data.fechaVenta}</span></div>

  <div class="total-row">
    <span>TOTAL</span>
    <span class="total-value">${data.total}</span>
  </div>
</div>

<!-- QR -->
<div class="qr">
  <img src="data:image/png;base64,${data.qrBase64}" />
</div>

<!-- LEGAL COMPLETO (SIN RESUMIR) -->
<div class="footer-note">
Consulte la Validez de esta Factura Electrónica con el Número de CDC en:<br/>
https://ekuatia.set.gov.py/consultas/<br/><br/>

${data.cdc || ""}<br/><br/>

ESTE DOCUMENTO ES UNA REPRESENTACION GRAFICA DE UN DOCUMENTO ELECTRONICO ( XML )<br/><br/>

Por Disposición de la SET, en el Decreto 312/18<br/>
a los comprobantes innominados ( SIN NOMBRE ),<br/>
no se les permite realizar Notas de Crédito,<br/>
por lo que sugerimos mencionar el Número de CI o RUC.<br/><br/>

PASADAS LAS 72 hs, NO SE ACEPTARAN RECLAMOS<br/><br/>

Ejemplar Original
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
