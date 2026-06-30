require("dotenv").config();
const express = require("express");
const ticketRoutes = require("./routes/ticketRoutes");
const mailRoutes = require("./routes/mailRoutes");
const pdfMailRoutes = require("./routes/pdfMailRoutes");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//app.use(express.json());

app.use("/api/tickets", ticketRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/pdf-mail", pdfMailRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Servidor activo y respondiendo",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const previewController = require("./controllers/previewController");
app.get("/preview-ticket", previewController.previewTicket);
app.get("/preview-corporate", previewController.previewCorporate);
app.get("/preview-convenios", previewController.previewConvenios);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
