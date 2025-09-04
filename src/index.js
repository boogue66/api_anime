import "dotenv/config";
import app from "./app.js";
import "./database.js";
import axios from "axios"; // Asegúrate de tener axios instalado

const PORT = app.get("port");

app.listen(PORT, () => {
  console.log("Server on port", PORT);


});
