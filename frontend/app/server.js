// Importieren des Express-Frameworks und Zuweisen an die Variable 'express'
const express = require("express");

// Initialisierung einer Express-Anwendung
const app = express();
// Festlegen des Server-Ports
const PORT = process.env.PORT_FRONTEND || 3000;
const BACKEND_URL = `http://${process.env.FREEUNTIS_SERVERNAME || "localhost"}:${process.env.PORT_BACKEND || 8000}`;
// Falls keine Umgebungsvariable gesetzt ist, wird der Port 3000 verwendet.


// Expose the BACKEND_URL via a config.js file
app.get("/config.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(`export const BACKEND_URL = '${BACKEND_URL}';`);
});

// Konfigurieren der Express-Anwendung, um statische Dateien aus dem Verzeichnis "public" bereitzustellen
app.use(express.static("public"));

// Starten des Servers und Zuweisen eines Callbacks, der eine Nachricht in der Konsole ausgibt
// sobald der Server gestartet ist
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
