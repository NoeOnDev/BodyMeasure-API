import cors from "cors";
import express from "express";
import { testConnection } from "./config/dbConfig";
import { env } from "./config/envConfig";
import { startConsumer } from "./IoT/consumer";
import doctorRoutes from "./doctor/doctorRoutes";
import patientRoutes from "./patient/patientRoutes";
import iotRoutes from "./IoT/IoTRoutes";

const app = express();
const PORT = env.port;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

app.use(doctorRoutes);
app.use(patientRoutes);
app.use(iotRoutes);

const startServer = async () => {
  try {
    await testConnection();
    await startConsumer();
    app.listen(PORT, () => {
      console.log("Servidor iniciado en el puerto " + PORT + " 🚀");
    });
  } catch (error) {
    console.error(
      "No se pudo iniciar el servidor debido a un error de conexión a la base de datos"
    );
  }
};

startServer();
