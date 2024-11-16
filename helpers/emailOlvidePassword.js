import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { email, nombre, token } = datos;
      //Enviar email
      const info = await transport.sendMail({
          from: 'APV - Administrador de Pacientes de Veterinaria',
          to: email,
          subject: 'Reestablece tu contraseña',
          text: 'Reestablece tu contraseña',
          html: `<p>Hola: ${nombre}, has solicitado reestablecer tu contraseña.</p>
                <p>Sigue el siguiente enlace paa generar tu contraseña nueva:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Contraseña</a></p>

                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
                `
      });

      console.log("Mensaje enviado: %s", info.messageId);
}

export default emailOlvidePassword;