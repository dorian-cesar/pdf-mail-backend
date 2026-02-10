require("dotenv").config();
const express = require("express");
const ticketRoutes = require("./routes/ticketRoutes");
const mailRoutes = require("./routes/mailRoutes");
const pdfMailRoutes = require("./routes/pdfMailRoutes");

const app = express();
app.use(express.json());

app.use("/api/tickets", ticketRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/pdf-mail", pdfMailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
