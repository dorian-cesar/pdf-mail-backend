const modernTicket = (data) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    :root { --primary: #6366f1; --secondary: #4f46e5; --text: #1f2937; }
    body { font-family: 'Inter', system-ui, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px; }
    .ticket { 
      background: white; max-width: 700px; margin: auto; border-radius: 24px; 
      overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
      border: 1px solid #e5e7eb;
    }
    .header { 
      background: linear-gradient(135deg, var(--primary), var(--secondary)); 
      padding: 30px; color: white; display: flex; justify-content: space-between; align-items: center;
    }
    .status-badge { 
      background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 99px; 
      font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
    }
    .content { padding: 40px; }
    .route { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    .city { flex: 1; }
    .city-code { font-size: 32px; font-weight: 800; color: var(--text); margin: 0; }
    .city-name { color: #6b7280; font-size: 14px; text-transform: uppercase; }
    .plane-icon { padding: 0 20px; color: #d1d5db; font-size: 24px; }
    
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; border-top: 1px solid #f3f4f6; padding-top: 24px; }
    .info-group { margin-bottom: 10px; }
    .label { font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
    .value { font-size: 15px; color: var(--text); font-weight: 600; }
    
    .passenger-box { 
      background: #f9fafb; border-radius: 16px; padding: 20px; margin-top: 30px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .qr-placeholder { width: 80px; height: 80px; background: #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-top: 1px dashed #e5e7eb; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <div>
        <div class="status-badge">Confirmado</div>
        <h2 style="margin: 10px 0 0 0;">${data.empresa}</h2>
      </div>
      <div style="text-align: right;">
        <div class="label" style="color: rgba(255,255,255,0.7);">Reserva</div>
        <div style="font-size: 20px; font-weight: 700;">#${data.reservaCodigo}</div>
      </div>
    </div>

    <div class="content">
      <div class="route">
        <div class="city">
          <p class="city-code">${data.origen.substring(0, 3).toUpperCase()}</p>
          <p class="city-name">${data.origen}</p>
        </div>
        <div class="plane-icon">━━ 🚌 ━━</div>
        <div class="city" style="text-align: right;">
          <p class="city-code">${data.destino.substring(0, 3).toUpperCase()}</p>
          <p class="city-name">${data.destino}</p>
        </div>
      </div>

      <div class="grid">
        <div class="info-group"><div class="label">Fecha</div><div class="value">${data.fechaViaje}</div></div>
        <div class="info-group"><div class="label">Salida</div><div class="value">${data.horaSalida}</div></div>
        <div class="info-group"><div class="label">Asiento</div><div class="value">${data.asientos}</div></div>
        <div class="info-group"><div class="label">Servicio</div><div class="value">${data.servicioTipo}</div></div>
        <div class="info-group"><div class="label">Terminal</div><div class="value">${data.terminal}</div></div>
        <div class="info-group"><div class="label">Puerta</div><div class="value">${data.puerta}</div></div>
      </div>

      <div class="passenger-box">
        <div>
          <div class="label">Pasajero</div>
          <div class="value" style="font-size: 18px;">${data.pasajeroNombre}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">ID: ${data.documento}</div>
        </div>
        <div class="qr-placeholder">CÓDIGO QR</div>
      </div>
    </div>

    <div class="footer">
      Escanee este boleto al abordar. Total Pagado: ${data.total}
    </div>
  </div>
</body>
</html>
`;

module.exports = modernTicket;
