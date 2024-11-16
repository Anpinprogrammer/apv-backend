import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",/*Cada cuanto el JWT va a expirar y el usuario debera volver a autenticarse */
    });
};

export default generarJWT;