import nodemailer from "nodemailer";

const emailAgendado = async (datos) => {

    const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha)
        return new Intl.DateTimeFormat('es-ES', {dateStyle: 'long'}).format(nuevaFecha)
    }
    
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAUTH2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OUTH_CLIENT_SECRET,
        refreshToken: process.env.OUTH_REFRESH_TOKEN
    }
    });

      const { email, propietario, nombre, fecha, veterinario } = datos;
      //Enviar email
      const info = await transporter.sendMail({
          from: 'andresspinedago@gmail.com',
          to: email,
          subject: 'Cita Agendada',
          text: `Cita agendada para ${nombre}`,
          html: `<p>Hola: ${propietario}, queriamos confirmar la cita para tu mascota en APV.</p>
                <p>Informacion de la cita:
                <p>Nombre de la mascota: ${nombre}</p>
                <p>Fecha de la cita: ${formatearFecha(fecha)
                    
                }</p>
                <p>Veterinario a cargo: ${veterinario}</p>

                <p>Por favor confirmar asistencia a la cita</p>
                `
      });

      console.log("Mensaje enviado: %s", info.messageId);
}

export default emailAgendado;