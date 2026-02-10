const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mailController");

router.post("/send-ticket", mailController.sendTicketByEmail);

module.exports = router;
