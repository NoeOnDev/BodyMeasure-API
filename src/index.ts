import cors from 'cors';
import express from 'express';
import { testConnection } from './config/dbConfig';
import { env } from './config/envConfig';
import doctorRoutes from './doctor/doctorRoutes';

const app = express();
const PORT = env.port;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Servidor funcionando correctamente 🚀');
});

app.use(doctorRoutes);

const startServer = async () => {
    try {
        await testConnection();
        app.listen(PORT, () => {
            console.log('Servidor iniciado en el puerto ' + PORT + ' 🚀');
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor debido a un error de conexión a la base de datos');
    }
};

startServer();
