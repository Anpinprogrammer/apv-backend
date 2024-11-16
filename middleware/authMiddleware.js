import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(" ")[1];//Guardamos el token que se ha enviado con la URL, mostramos la posicion 1 ya que split crea un arreglo con dos posiciones y la posicion 0 seria la palabrar Bearer
            const decoded = jwt.verify(token, process.env.JWT_SECRET);//Verificamos el token decodificado

            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");//Colocando el req al inicio de la variable estamos creando una sesion para esa variable

            return next();
        } catch (error) {
            const error1 = new Error('Token no valido');
            res.status(403).json({ msg: error1.message });
        }
    } 

    if(!token) {
        const error = new Error('Token no valido o inexistente');
        res.status(403).json({ msg: error.message });
    }
    
    next();
};

export default checkAuth;