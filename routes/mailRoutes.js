const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mailController");

router.post("/send-ticket", mailController.sendTicketByEmail);

// Ruta para el formulario de Reservas Corporativas
router.post("/send-email", mailController.sendCorporateEmail);

module.exports = router;
