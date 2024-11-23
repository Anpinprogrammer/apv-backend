import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
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

      const { email, nombre, token } = datos;
      //Enviar email
      const info = await transporter.sendMail({
          from: 'andresspinedago@gmail.com',
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