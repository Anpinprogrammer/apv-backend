import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from '../helpers/generarId.js';

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true/*Para que elimine los espacios en caso de que el usuario ponga algun espacio */
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,/*Garantizamos que utiliza un email por cuenta*/
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    },

});

veterinarioSchema.pre('save', async function (next) {

    //Validacion si el password ya esta hasheado
    if(!this.isModified("password")) {
        next();
    }

    //Hashear el password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});//Utilizamos function para poder usar this

veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);//Retorna true or false
};

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);//Almacena el registro

export default Veterinario;