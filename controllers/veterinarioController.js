import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

const registrar = async (req, res) => {

    //Registrar usuario: trae los datos que se le estan enviando desde postman
    const { email, nombre } =  req.body;

    //Revisar si un usuario ya esta registrado para prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email});

    if(existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(404).json({msg: error.message});
    }

    
    try {
        //Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterianrioGuardado = await veterinario.save();//Guarda el usuario en la base de datos

        //Enviar email
        emailRegistro({
            email,
            nombre,
            token: veterianrioGuardado.token
        });

        res.json(veterianrioGuardado);
    } catch (error) {
        console.log(error);
    }


    
};

const perfil = (req, res) => {

    const { veterinario } = req;
    res.json(veterinario);
};

const confirmar = async (req, res) => {

    //Leer un parametro de la url
    const {token} = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token});//Consulta de la base de datos

    if(!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();//Guardamos los cambios en la base de datos

        res.json({ msg: "Usuario confirmada Correctamente" });
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {

    const { email, password } = req.body;

    //Comprueba si el usuario existe
    const usuario = await Veterinario.findOne({email});

    if(!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(403).json({ msg: error.message });
    }


    //Confirmar si el usuario esta confirmado
    if(!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }

    //Revisar password 
    if( await usuario.comprobarPassword(password) ) {
        //Autenticacion
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),/**Genera el JWT */
        });
    } else {
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message});
    }
};

const olvidePassword = async (req, res) => {
    const  { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario) {
        const error = new Error('Usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //Enviar email con las instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });

    } catch (error) {
        console.log(error);
    }
    
};

const comprobarToken = async (req, res) => {
     const { token } = req.params;
     const tokenValido = await Veterinario.findOne({ token });

     if(tokenValido) {
        //El token es valido el usuario existe
        res.json({ msg: 'Token valido y el usuario existe' });
     } else {
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message });
     }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;//Lo que viene en la URL
    const { password } = req.body;//Lo que el usuario escribe en los inputs

    const veterinario = await Veterinario.findOne({ token });
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;//Elimina el token para que sea de un solo uso y no le puedan cambiar la contraseña nadie mas 
        veterinario.password = password;//Asigna la nueva password enviada
        await veterinario.save();
        res.json({ msg: 'Password modificado correctamente' });
    } catch (error) {
        console.log(error);
    }

};

const actualizarPerfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;
    if(veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email });
        if(existeEmail) {
            const error = new Error('Email ya existe')
            return res.status(400).json({ msg: error.message })
        }
    }
    
    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.telefono = req.body.telefono || veterinario.telefono;
        veterinario.web = req.body.web || veterinario.web;

        const veterinarioActualizado = await veterinario.save();
        res.json({veterinarioActualizado});
    } catch (error) {
        console.log(error)
    }
};

const actualizarPassword = async (req, res) => {
    console.log(req.veterinario);
    console.log(req.body.pwd_actual);

    //Leer los datos
    const veterinario = await Veterinario.findOne(req.veterinario);

    //Comprobar que el veterinario exista
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    //Comprobar su password
    if( !await veterinario.comprobarPassword(req.body.pwd_actual) ){
        const error = new Error('La contraseña actual es incorrecta');
        return res.status(400).json({ msg: error.message });
    }


    //Almacenar el nuevo password
    try {
        veterinario.password = req.body.pwd_nuevo;
        await veterinario.save();
        res.json({ msg: 'Contraseña actualizada' });
    } catch (error) {
        console.log(error);
    }
};

export {
    registrar,
    perfil,
    confirmar,
    autenticar, 
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}