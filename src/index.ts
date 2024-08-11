import cors from 'cors';
import express from 'express';
import { env } from './config/envConfig';

const app = express();
const PORT = env.port;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('API bodyMeasures is running on port ' + PORT);
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
