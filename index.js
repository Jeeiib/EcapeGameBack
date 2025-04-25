const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Import des routes
const clientsRoutes = require("./routes/clientsRoutes");
const authRoutes = require("./routes/authRoutes");
const escapesRoutes = require("./routes/escapeRoutes");
const paymentsRoutes = require("./routes/paymentsRoutes");
const reservationRoutes = require("./routes/reservationRoute");
const contactRoutes = require("./routes/contactRoute");
const galleryRoutes = require("./routes/galleryRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

// Configuration Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Configuration des routes
app.use("/clients", clientsRoutes);
app.use("/auth", authRoutes);
app.use("/escapes", escapesRoutes);
app.use("/payments", paymentsRoutes);
app.use("/reservations", reservationRoutes);
app.use("/contact", contactRoutes);
app.use("/gallery", galleryRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route de base
app.get("/", (req, res) => {
  res.send("Welcome to the Escape Game API");
});

// Démarrer le serveur uniquement si le fichier est exécuté directement (pas importé)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}


module.exports = app;