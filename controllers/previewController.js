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
      reservaCodigo: "70030020000053",
      servicio: "Semicama",
      email: "ejemplo@gmail.com",
      fechaNacimiento: "05/08/1985",
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

exports.previewCorporate = async (req, res) => {
  try {
    const corporateTemplate = require("../templates/corporateTemplate");

    const mockData = {
      nombre: "Diego Wigosdki",
      empresa: "WIT S.A.",
      rut: "76.123.456-7",
      cargo: "Gerente de Innovación",
      email: "dwigodski@wit.la",
      telefono: "+56 9 8765 4321",
      empleados: "50 - 100",
      mensaje: "Hola, nos gustaría solicitar una cotización especial para viajes frecuentes de nuestro personal corporativo entre Santiago y Viña del Mar.",
    };

    const html = corporateTemplate(mockData);
    res.send(html);
  } catch (error) {
    console.error("Error en previewCorporate:", error);
    res.status(500).send("Error al generar la vista previa corporativa");
  }
};

exports.previewConvenios = async (req, res) => {
  try {
    const ticketTemplate = require("../templates/ticket-convenios");

    const logoPath = path.join(
      __dirname,
      "../public/images/logo-pullmanbus.png",
    );

    let logoBase64 = "";

    if (fs.existsSync(logoPath)) {
      logoBase64 = fs.readFileSync(logoPath).toString("base64");
    }

    const mockData = {
      logoBase64: logoBase64,
      numero_ticket: "87654321",
      pnr: "PLM9876",
      monto_pagado: "$14.500",
      ciudad_origen: "SANTIAGO",
      ciudad_destino: "VIÑA DEL MAR",
      fecha_viaje: "25/04/2026",
      hora_salida: "18:30",
      numero_asiento: "24",
      terminal_origen: "TERMINAL ALAMEDA",
      terminal_destino: "TERMINAL VIÑA DEL MAR",
      empresa: {
        nombre: "PULLMAN BUS COSTA CENTRAL",
        rut: "76.123.456-7"
      },
      convenio: {
        nombre: "CONVENIO UNIVERSIDAD DE VALPARAÍSO"
      },
      pasajero: {
        nombres: "PEDRO PABLO",
        apellidos: "GARCÍA MUÑOZ",
        rut: "18.765.432-1"
      }
    };

    const html = await ticketTemplate(mockData);
    res.send(html);
  } catch (error) {
    console.error("Error en previewConvenios:", error);
    res.status(500).send("Error al generar la vista previa del ticket de convenios");
  }
};

