import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';


const app = express();
app.use(express.json());//Lo usamos para poder leer respuestas POST de tipo json

dotenv.config();

conectarDB();

//Configuracion del cors
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1 ) {
            //Origen del request esta permitido
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    }
};
app.use(cors(corsOptions));

app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 4000;




app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})