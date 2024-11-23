import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
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
          subject: 'Confirma tu cuenta en APV',
          text: 'Confirma tu cuenta en APV',
          html: `<p>Hola: ${nombre}, confirma tu cuenta en APV.</p>
                <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>

                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
                `
      });

      console.log("Mensaje enviado: %s", info.messageId);
}

export default emailRegistro;