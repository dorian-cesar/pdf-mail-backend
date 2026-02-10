require("dotenv").config();
const express = require("express");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
app.use(express.json());

app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
