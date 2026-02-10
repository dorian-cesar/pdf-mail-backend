const ticketTemplate = (data) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #004a99; color: #ffffff; padding: 20px; text-align: center; }
    .section { padding: 20px; border-bottom: 1px solid #eeeeee; }
    .label { color: #888888; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
    .value { color: #333333; font-size: 16px; font-weight: bold; }
    .row { display: table; width: 100%; margin-bottom: 15px; }
    .col { display: table-cell; width: 50%; vertical-align: top; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #777777; }
    .badge { background-color: #e7f3ff; color: #004a99; padding: 5px 10px; border-radius: 4px; font-size: 14px; }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
  <div class="container">
    <!-- Encabezado -->
    <div class="header">
      <h2 style="margin: 0;">¡Reserva Confirmada!</h2>
      <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Tu pago con tarjeta ha sido procesado exitosamente.</p>
    </div>

    <!-- Código de Reserva -->
    <div class="section" style="text-align: center; background-color: #fffde7;">
      <div class="label">Código de Reserva</div>
      <div style="font-size: 24px; color: #d32f2f; font-weight: bold; letter-spacing: 2px;">${data.reservaCodigo}</div>
    </div>

    <!-- Detalles del Viaje -->
    <div class="section">
      <h3 style="color: #004a99; margin-top: 0;">Viaje de Ida</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="40%">
            <div class="label">Salida</div>
            <div class="value">${data.horaSalida}</div>
            <div style="font-size: 14px;">${data.origen}</div>
          </td>
          <td width="20%" align="center">
            <span style="font-size: 24px;"></span>
          </td>
          <td width="40%" align="right">
            <div class="label">Llegada</div>
            <div class="value">${data.horaLlegada}</div>
            <div style="font-size: 14px;">${data.destino}</div>
          </td>
        </tr>
      </table>
      <div style="margin-top: 15px; font-size: 14px; color: #555;">
        🗓 <strong>${data.fechaViaje}</strong> • ⏳ ${data.duracion}
      </div>
    </div>

    <!-- Información del Bus -->
    <div class="section">
      <div class="row">
        <div class="col">
          <div class="label">Empresa</div>
          <div class="value">${data.empresa}</div>
        </div>
        <div class="col">
          <div class="label">Servicio</div>
          <div class="value">${data.servicioTipo}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">Asiento(s)</div>
          <div class="badge">${data.asientos}</div>
        </div>
        <div class="col">
          <div class="label">Terminal / Puerta</div>
          <div class="value">${data.terminal} (Puerta ${data.puerta})</div>
        </div>
      </div>
    </div>

    <!-- Pasajero -->
    <div class="section">
      <h3 style="color: #004a99; margin-top: 0;">Información del Pasajero</h3>
      <div style="font-size: 14px; line-height: 1.6;">
        <strong>Nombre:</strong> ${data.pasajeroNombre}<br>
        <strong>Documento:</strong> ${data.documento}<br>
        <strong>Teléfono:</strong> ${data.telefono}
      </div>
    </div>

    <!-- Resumen de Pago -->
    <div class="section" style="background-color: #fafafa;">
      <h3 style="margin-top: 0; font-size: 16px;">Resumen del Pago</h3>
      <table width="100%" style="font-size: 14px; line-height: 2;">
        <tr><td>Subtotal</td><td align="right">${data.subtotal}</td></tr>
        <tr><td>IVA (10%)</td><td align="right">${data.iva}</td></tr>
        <tr><td>Servicio (8%)</td><td align="right">${data.cargoServicio}</td></tr>
        <tr style="font-size: 18px; font-weight: bold; color: #333;">
          <td style="padding-top: 10px; border-top: 1px solid #ddd;">Total Pagado</td>
          <td align="right" style="padding-top: 10px; border-top: 1px solid #ddd;">${data.total}</td>
        </tr>
      </table>
      <p style="font-size: 11px; color: #999; margin-top: 15px;">
        Pago realizado el ${data.pagoFecha} via ${data.metodoPago}
      </p>
    </div>

    <div class="footer">
      Este es un boleto electrónico. Por favor, preséntalo junto a tu documento de identidad al abordar.<br>
      <strong>¡Buen viaje!</strong>
    </div>
  </div>
</body>
</html>
`;

module.exports = ticketTemplate;
