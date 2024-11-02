const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Servidor listo para enviar correos');
  }
});

exports.sendPasswordResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Restablecimiento de contraseña',
    text: `Has recibido este correo porque tú (o alguien más) ha solicitado el restablecimiento de la contraseña de tu cuenta.\n\n
    Por favor, haz clic en el siguiente enlace o pégalo en tu navegador para completar el proceso:\n\n
    ${resetUrl}\n\n
    Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.\n`,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendWelcomeEmail = async (email, name, temporaryPassword) => {
  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Bienvenido a nuestra plataforma',
    text: `Hola ${name},\n\n
    Bienvenido a nuestra plataforma. Esperamos que disfrutes de nuestros servicios.\n\n
    Tu contraseña temporal es: ${temporaryPassword}\n\n
    Si tienes alguna duda o problema, no dudes en contactarnos.\n`,
  };

  await transporter.sendMail(mailOptions);
};
