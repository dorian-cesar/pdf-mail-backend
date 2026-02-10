const express = require("express");
const router = express.Router();
const pdfMailController = require("../controllers/pdfMailController");

router.post("/send-confirmed", pdfMailController.sendExistingPdf);

module.exports = router;
