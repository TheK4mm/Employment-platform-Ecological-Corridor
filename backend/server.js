require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
const usersRoutes = require("./routes/users");
const jobsRoutes = require("./routes/jobs");
const postRoutes = require("./routes/postulations");

app.use("/api/usuarios", usersRoutes);
app.use("/api/ofertas", jobsRoutes);
app.use("/api/postulaciones", postRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
});
