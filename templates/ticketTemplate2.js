const ticketTemplate = (data) => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

      @page {
        size: A4;
        margin: 0;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Inter", sans-serif;
        font-size: 14px;
        background: white;
      }

      .ticket-container {
        width: 794px;
        /* height: 1123px; */
        height: 920px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 30px 40px;
      }

      .ticket-header {
        background: #1e293b;
        padding: 25px;
        color: white;
        text-align: center;
        border-radius: 8px;
      }

      .company-name {
        font-size: 30px;
        font-weight: 700;
        margin-bottom: 6px;
      }

      .trip-type {
        font-size: 14px;
        text-transform: uppercase;
        color: #cbd5e1;
      }

      .ticket-body {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .route-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f1f5f9;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      }

      .route-point {
        text-align: center;
        flex: 1;
      }

      .route-connector {
        flex: 0 0 100px;
        height: 4px;
        background: #334155;
        margin: 0 20px;
        position: relative;
      }

      .location-label {
        font-size: 11px;
        color: #64748b;
        margin-bottom: 4px;
        text-transform: uppercase;
      }

      .location-name {
        font-size: 22px;
        font-weight: 600;
      }

      .terminal-name {
        font-size: 12px;
        color: #64748b;
      }

      .date-hour {
        display: flex;
        flex-direction: column;
        font-weight: 500;
        margin-top: 6px;
      }

      .top-row {
        display: flex;
        gap: 20px;
        justify-content: space-evenly;
      }

      .detail-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-weight: 600;
        font-size: 1rem;
        color: #333;
      }

      .detail-value {
        font-size: 1.2rem;
        font-weight: 600;
        color: #000;
        margin-top: 3px;
      }

      .bottom-row {
        display: flex;
        gap: 20px;
        justify-content: space-evenly;
        margin-top: 10px;
      }

      .details-section {
        flex: 1;
        max-width: 300px;
        background: #fafafa;
        padding: 12px;
        border-radius: 6px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        justify-content: start;
        gap: 12px;
      }

      .seat-details {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .details-qr-container {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 20px;
      }

      .details-section,
      .qr-section {
        flex: 1;
        max-width: 330px;
        min-height: 244px;
        gap: 15px;
        background: #fafafa;
        padding: 20px;
        border-radius: 6px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
      }

      .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px 20px;
      }

      .detail-label {
        font-weight: 600;
        font-size: 1rem;
        color: #555;
      }

      .qr-section {
        flex: 1;
        max-width: 330px;
        background: #fafafa;
        padding: 12px;
        border-radius: 6px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
        text-align: center;
      }

      .qr-label {
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 10px;
        color: #333;
      }

      .qr-code {
        max-width: 100%;
        height: auto;
        display: inline-block;
      }

      .auth-section {
        margin-top: 20px;
        text-align: center;
      }

      .auth-label {
        font-weight: 600;
        margin-bottom: 6px;
        color: #555;
      }

      .auth-code {
        font-weight: 700;
        font-size: 1.1rem;
        color: #000;
        margin-bottom: 10px;
      }

      .footer-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .footer {
        padding: 20px;
        border-radius: 10px;
        background: #f1f5f9;
        text-align: center;
      }

      .footer-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .footer-instructions {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 10px;
      }

      .instruction-item {
        font-size: 13px;
        padding: 6px 12px;
        border: 1px solid #9b9b9b;
        border-radius: 16px;
        background: rgb(246, 246, 255);
        color: #334155;
      }

      .footer-note {
        font-size: 11px;
        color: #64748b;
        font-style: italic;
      }

      .company-info {
        background: #1e293b;
        color: #cbd5e1;
        font-size: 11px;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        border-radius: 6px;
      }

      .company-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .company-logo {
        width: 20px;
        height: 20px;
        background: #10b981;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
      }

      .company-right {
        display: flex;
        align-items: center;
        opacity: 0.8;
      }
    </style>
  </head>
  <body>
    <div class="ticket-container">
      <div class="ticket-header">
        <div class="company-name">${trip.company || "BusExpress"}</div>
        <div class="trip-type">
          Boleto de ${tripType === "ida" ? "Ida" : "Vuelta"}
        </div>
      </div>

      <div class="ticket-body">
        <div class="route-section">
          <div class="route-point">
            <div class="location-label">Origen</div>
            <div class="location-name">${trip.origin}</div>
            <div class="terminal-name">${trip.terminalOrigin}</div>
            <div class="date-hour">
              <div>${formatDate(trip.date)}</div>
              <div>${trip.departureTime} hrs</div>
            </div>
          </div>
          <div class="route-connector"></div>
          <div class="route-point">
            <div class="location-label">Destino</div>
            <div class="location-name">${trip.destination}</div>
            <div class="terminal-name">${trip.terminalDestination}</div>
            <div class="date-hour">
              <div>${formatDate(trip.arrivalDate)}</div>
              <div>${trip.arrivalTime} hrs</div>
            </div>
          </div>
        </div>

        <div class="bottom-row">
          <div class="details-section">
            <div class="seat-details">
              <div class="detail-item">
                <div class="detail-label">Asiento</div>
                <div class="detail-value">${seat.asiento}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Piso</div>
                <div class="detail-value">
                  ${seat.floor === "floor1" ? "1" : "2"}
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Tipo</div>
                <div class="detail-value">
                  ${
                    seat.floor === "floor1"
                      ? trip.seatLayout.tipo_Asiento_piso_1
                      : trip.seatLayout.tipo_Asiento_piso_2
                  }
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Precio</div>
                <div class="detail-value">Gs. ${seat.valorAsiento}</div>
              </div>
            </div>
          </div>

          <div class="qr-section">
            <div class="qr-label">Código QR</div>
            <img src="${qrImage}" alt="QR Code" class="qr-code" />
          </div>
        </div>

        <div class="auth-section">
          <div class="auth-label">Código de Transacción</div>
          <div class="auth-code">${seat.authCode || authCode || "N/A"}</div>
        </div>
      </div>

      <div class="footer-container">
        <div class="footer">
          <div class="footer-title">¡Gracias por viajar con nosotros!</div>
          <div class="footer-instructions">
            <span class="instruction-item"
              >Presenta este boleto al abordar</span
            >
            <span class="instruction-item">Lleva identificación válida</span>
            <span class="instruction-item">Llega 30 minutos antes</span>
          </div>
          <div class="footer-note">
            Este boleto es intransferible. Válido únicamente para la fecha y
            horario especificados.
          </div>
        </div>

        <div class="company-info">
          <div class="company-left">
            <div class="company-logo">B</div>
            <span>Boleto generado electrónicamente</span>
          </div>
          <div class="company-right">
            <span
              >Sistema de reservas BusExpress © ${new Date().getFullYear()}</span
            >
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
