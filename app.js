require("dotenv").config();
const express = require("express");
const ticketRoutes = require("./routes/ticketRoutes");
const mailRoutes = require("./routes/mailRoutes");

const app = express();
app.use(express.json());

app.use("/api/tickets", ticketRoutes);
app.use("/api/mail", mailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
