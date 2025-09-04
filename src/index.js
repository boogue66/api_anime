import "dotenv/config";
import app from "./app.js";
import "./database.js";
import axios from "axios"; // Asegúrate de tener axios instalado

const PORT = app.get("port");

app.listen(PORT, () => {
  console.log("Server on port", PORT);

  // === Auto-ping interno ===
  const URL = `https://api-anime-6wv4.onrender.com:${PORT}/health`; // O tu URL pública
  const INTERVAL = 5 * 60 * 1000; // cada 5 minutos

  setInterval(async () => {
    try {
      const response = await axios.get(URL);
      console.log(`${new Date().toLocaleString()} - Ping OK: ${response.status}`);
    } catch (error) {
      console.error(`${new Date().toLocaleString()} - Error ping: ${error.message}`);
    }
  }, INTERVAL);
});
