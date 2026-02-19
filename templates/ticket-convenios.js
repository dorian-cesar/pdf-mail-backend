const modernCorporateTicket = (data) => `
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            width: 210mm;
            height: 297mm;
            padding: 15mm;
            background: #ffffff;
            font-size: 11px;
            color: #1a1a1a;
        }

        .ticket {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .company-logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 5px;
        }

        /* HEADER */
        .header {
            background: linear-gradient(135deg, #023caf 0%, #012b8f 100%);
            color: white;
            padding: 25px;
            border-radius: 14px;
            margin-bottom: 25px;
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .badge {
            background: #ff6700;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
        }

        .pnr {
            margin-top: 15px;
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #ff6700;
        }

        /* VIAJE */
        .trip {
            background: #f5f8ff;
            border: 2px solid #e6ecff;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .route {
            font-size: 18px;
            font-weight: 800;
            color: #023caf;
            margin-bottom: 15px;
        }

        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .item-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 3px;
        }

        .item-value {
            font-weight: 600;
            font-size: 13px;
        }

        .seat-price {
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }

        .seat {
            font-weight: 700;
            font-size: 14px;
        }

        .price {
            font-weight: 800;
            font-size: 16px;
            color: #ff6700;
        }

        .info {
            display: flex;
            gap: 20px;
            width: 100%;
        }

        .info .trip {
            flex: 1;
        }

        .trip h3 {
            color: #023caf;
            margin-bottom: 10px;
            font-size: 13px;
            text-transform: uppercase;
        }

        .passenger-name {
            font-size: 17px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        /* PAGO */
        .payment {
            border: 2px solid #023caf;
            border-radius: 14px;
            padding: 20px;
            margin-bottom: 20px;
            background: #f9fbff;
        }

        .payment-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .total {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #023caf;
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: 800;
            color: #ff6700;
        }

        .footer {
            margin-top: auto;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>

<body>
    <div class="ticket">

        ${data.logoBase64 ? `<img src="data:image/png;base64,${data.logoBase64}" class="company-logo">` : ''}

        <!-- HEADER -->
        <div class="header">
            <div class="header-top">
                <div>
                    <h1>${data.convenio?.nombre}</h1>
                    <div>Ticket N° ${data.numero_ticket}</div>
                </div>
                <div class="badge">${data.estado?.toUpperCase()}</div>
            </div>
        </div>

        <!-- VIAJE -->
        <div class="trip">
            <div class="route">
                ${data.ciudad_origen} → ${data.ciudad_destino}
            </div>

            <div class="grid">
                <div>
                    <div class="item-label">Fecha</div>
                    <div class="item-value">${data.fecha_viaje}</div>
                </div>
                <div>
                    <div class="item-label">Hora Salida</div>
                    <div class="item-value">${data.hora_salida}</div>
                </div>
                <div>
                    <div class="item-label">Terminal Origen</div>
                    <div class="item-value">${data.terminal_origen}</div>
                </div>
                <div>
                    <div class="item-label">Terminal Destino</div>
                    <div class="item-value">${data.terminal_destino}</div>
                </div>
            </div>

            <div class="seat-price">
                <div class="seat">Asiento: ${data.numero_asiento}</div>
                <div class="price">$${data.monto_pagado}</div>
            </div>
        </div>

        <div class="info">
            <div class="trip">
                <h3>Pasajero</h3>
                <div class="passenger-name">
                    ${data.pasajero?.nombres} ${data.pasajero?.apellidos}
                </div>
                <div>RUT: ${data.pasajero?.rut}</div>
            </div>

            <div class="trip">
                <h3>Empresa</h3>
                <div>${data.empresa?.nombre}</div>
                <div>RUT: ${data.empresa?.rut}</div>
            </div>
        </div>

        <!-- PAGO -->
        <div class="payment">
            <div class="payment-row">
                <span>Tarifa Base</span>
                <span>$${data.tarifa_base}</span>
            </div>

            <div class="payment-row">
                <span>Descuento Aplicado (${data.porcentaje_descuento_aplicado}%)</span>
                <span>-$${data.tarifa_base - data.monto_pagado}</span>
            </div>

            <div class="total">
                <span>Total Pagado</span>
                <span>$${data.monto_pagado}</span>
            </div>
        </div>

        <div class="footer">
            Código autorización: ${data.codigo_autorizacion} <br />
            Documento generado electrónicamente
        </div>

    </div>
</body>

</html>
`;

module.exports = modernCorporateTicket;