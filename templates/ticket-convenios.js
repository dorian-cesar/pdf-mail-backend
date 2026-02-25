const modernCorporateTicket = (data) => `
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            background: #ffffff;
            font-size: 12px;
            color: #333;
            line-height: 1.4;
        }

        .ticket-container {
            max-width: 700px;
            margin: 0 auto;
        }

        /* HEADER */
        .header {
            margin-bottom: 20px;
        }

        .header h4 {
            color: #666;
            font-weight: 400;
            font-size: 11px;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .brand-logo {
            width: 280px;
            margin-bottom: 15px;
        }

        .disclaimer {
            font-size: 11px;
            color: #888;
            max-width: 90%;
            margin-bottom: 20px;
        }

        .section-title {
            color: #ff6600;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 10px;
        }

        /* TABLA DE DATOS */
        .data-box {
            border: 1px solid #999;
            padding: 15px 25px;
            margin-bottom: 10px;
        }

        .row {
            display: flex;
            margin-bottom: 4px;
        }

        .label {
            width: 160px;
            font-weight: 800;
            font-size: 11px;
        }

        .value {
            flex: 1;
            font-size: 11px;
        }

        .value-bold {
            font-weight: 700;
        }

        /* PAGO Y ASIENTO */
        .payment-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
        }

        .total-box {
            font-size: 16px;
            font-weight: 800;
        }

        .total-amount {
            font-size: 20px;
            margin-left: 10px;
        }

        /* SEPARADOR */
        .divider {
            border-top: 1px dashed #999;
            margin: 20px 0 30px 0;
            position: relative;
        }

        .copy-label {
            text-align: end;
            color: #ff6600;
            font-weight: 700;
            font-size: 11px;
        }

        /* COPIA EMPRESA / BARCODE SECTION */
        .barcode-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 1px solid #999;
            padding: 20px;
        }

        .barcode-placeholder {
            font-family: 'Libre Barcode 128', cursive;
            /* Opcional si usas fuente de barras */
            font-size: 40px;
            margin-bottom: 5px;
        }

        .barcode-data {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            width: 100%;
            gap: 10px;
            margin-top: 15px;
        }

        .footer-note {
            border: 1px solid #333;
            padding: 10px;
            font-weight: 800;
            text-align: left;
            font-size: 10px;
        }

        @media print {
            body {
                padding: 0;
            }

            .ticket-container {
                width: 100%;
            }
        }
    </style>
</head>

<body>
    <div class="ticket-container">
        <div class="header">
            <h4>Boleto Electrónico</h4>
            ${data.logoBase64 ? `<img src="data:image/png;base64,${data.logoBase64}" class="brand-logo"
                alt="Pullman Bus">` : ''}

            <p class="disclaimer">Debe acreditar domicilio particular habitual y/o lugar de trabajo en la I o XV Región
                del país, en control o aduana sanitaria, bajo su responsabilidad.
            </p>
        </div>

        <div class="section-title">Datos del Servicio</div>

        <div class="data-box">
            <div class="row">
                <div class="label">EMPRESA:</div>
                <div class="value">${data.empresa?.nombre || ''}</div>
            </div>
            <div class="row">
                <div class="label">RUT EMPRESA:</div>
                <div class="value">${data.empresa?.rut || ''}</div>
            </div>
            <div class="row">
                <div class="label">CONVENIO:</div>
                <div class="value">${data.convenio?.nombre || ''}</div>
            </div>

            <div style="margin-top: 10px;"></div>

            <div class="row" style="margin-top: 8px;">
                <div class="label">PASAJERO:</div>
                <div class="value">
                    ${data.pasajero?.nombres}<br>
                    ${data.pasajero?.apellidos || ''}
                </div>
                <div class="value-bold">${data.pasajero?.rut || ''}</div>
            </div>

            <div style="margin-top: 15px;"></div>

            <div class="row">
                <div class="label">ORIGEN:</div>
                <div class="value">${data.ciudad_origen || ''}</div>
            </div>
            <div class="row">
                <div class="label">DESTINO:</div>
                <div class="value">${data.ciudad_destino || ''}</div>
            </div>

            <div class="row" style="margin-top: 10px;">
                <div class="label">FECHA VIAJE:</div>
                <div class="value">${data.fecha_viaje || ''}</div>
            </div>
            <div class="row">
                <div class="label">HORA VIAJE:</div>
                <div class="value">${data.hora_salida || ''}</div>
            </div>

            <div class="payment-row">
                <div>
                    <span class="label">ASIENTO:</span> <span class="value">${data.numero_asiento || ''}</span><br>
                    <span class="label">N° BOLETO:</span> <span class="value">${data.numero_ticket || ''}</span>
                </div>
                <div class="total-box">
                    VALOR PAGADO: <span class="total-amount">${data.monto_pagado || '0'}</span>
                </div>
            </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <p style="font-size: 11px; color: #555;">Este boleto es válido únicamente para la fecha y hora indicadas.</p>
            <span class="copy-label">Copia Cliente</span>
        </div>

        <div class="divider"></div>

        <div class="barcode-section">
            <div style="font-size: 10px; margin-bottom: 15px;">codigoSeguridad<br><strong>${data.pnr ||
                    ''}</strong></div>

            <div class="barcode-data">
                <div>
                    <div class="row">
                        <div class="label" style="width: 80px;">FECHA:</div>
                        <div class="value">${data.fecha_viaje || ''}</div>
                    </div>
                    <div class="row">
                        <div class="label" style="width: 80px;">HORA VIAJE:</div>
                        <div class="value">${data.hora_salida || ''}</div>
                    </div>
                    <div class="row" style="margin-top: 15px;">
                        <div class="label" style="width: 80px; font-size: 14px;">A PAGAR :</div>
                        <div class="value" style="font-size: 14px; font-weight: 800;">${data.monto_pagado || ''}</div>
                    </div>
                </div>
                <div>
                    <div class="row">
                        <div class="label" style="width: 80px;">T. ORIGEN:</div>
                        <div class="value">${data.terminal_origen || ''}</div>
                    </div>
                    <div class="row">
                        <div class="label" style="width: 80px;">T. DESTINO:</div>
                        <div class="value">${data.terminal_destino || ''}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="copy-label" style="margin-top: 10px; margin-bottom: 10px;">Copia Empresa</div>

        <div class="footer-note">
            BOLETO COMPRADO EN PORTAL DE CONVENIOS – NO ANULAR O DEVOLVER EN BOLETERÍAS.
        </div>

    </div>
</body>

</html>
`;

module.exports = modernCorporateTicket;