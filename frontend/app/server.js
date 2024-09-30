// Importieren des Express-Frameworks und Zuweisen an die Variable 'express'
const express = require("express");

// Initialisierung einer Express-Anwendung
const app = express();
// Festlegen des Server-Ports
const PORT = process.env.PORT || 3000;
// Falls keine Umgebungsvariable gesetzt ist, wird der Port 3000 verwendet.


// Konfigurieren der Express-Anwendung, um statische Dateien aus dem Verzeichnis "public" bereitzustellen
app.use(express.static("public"));

// Starten des Servers und Zuweisen eines Callbacks, der eine Nachricht in der Konsole ausgibt
// sobald der Server gestartet ist
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
