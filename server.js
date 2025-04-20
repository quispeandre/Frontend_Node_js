import express from 'express';
import rutas from './routes/routes.js';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3001;

// Configuración SEGURA de CORS
const corsOptions = {
  origin: [
    'http://localhost:3000', // Desarrollo local
    'https://app-57e82e76-496f-4bb0-8eb3-420a92cfaa6c.cleverapps.io/' // Producción (¡cambia esto!)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions)); // Aplica la configuración segura
app.use(express.json());
app.use('/api', rutas);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto: ${PORT}`);
});
