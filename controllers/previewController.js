const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");

exports.previewTicket = async (req, res) => {
  try {
    const ticketTemplate = require("../templates/ticket-boleto");

    const logoPath = path.join(
      __dirname,
      "../public/images/logo-santaniana-blanco.png",
    );
    const partnerLogoPath = path.join(
      __dirname,
      "../public/images/logo-boletos.png",
    );

    let logoBase64 = "";
    let logoPartnerBase64 = "";

    if (fs.existsSync(logoPath)) {
      logoBase64 = fs.readFileSync(logoPath).toString("base64");
    }
    if (fs.existsSync(partnerLogoPath)) {
      logoPartnerBase64 = fs.readFileSync(partnerLogoPath).toString("base64");
    }

    // Generar un QR de prueba
    const qrText =
      "https://ekuatia.set.gov.py/consultas/cdc?cdc=0180012667000100100012341202404221100000000";
    const qrBase64Full = await QRCode.toDataURL(qrText);
    const qrBase64 = qrBase64Full.replace(/^data:image\/png;base64,/, "");

    const mockData = {
      logoBase64: logoBase64,
      logoPartnerBase64: logoPartnerBase64,
      numeroFactura: "001-001-0001234",
      fechaVenta: "22/04/2026 10:30",
      origen: "Asunción",
      destino: "Ciudad del Este",
      fechaViaje: "25/04/2026",
      horaSalida: "08:00",
      horaLlegada: "13:30",
      duracion: "05:30 hs",
      asiento: "12",
      servicio: "Semicama",
      pasajeroNombre: "JUAN PÉREZ",
      documento: "1.234.567",
      total: "120.000 Gs.",
      cdc: "0180012667000100100012341202404221100000000",
      qrBase64: qrBase64,
    };

    const html = ticketTemplate(mockData);
    res.send(html);
  } catch (error) {
    console.error("Error en previewTicket:", error);
    res.status(500).send("Error al generar la vista previa");
  }
};
