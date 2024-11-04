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
    subject: 'bikefy - Restablecimiento de contraseña',
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #0056b3;">Restablecimiento de Contraseña</h2>
      <p>Has recibido este correo porque tú (o alguien más) ha solicitado el restablecimiento de la contraseña de tu cuenta.</p>
      <p>
        Por favor, haz clic en el siguiente enlace o pégalo en tu navegador para completar el proceso:
        <br><br>
        <a href="${resetUrl}" style="color: #0056b3; font-weight: bold;">Restablecer Contraseña</a>
      </p>
      <p>Si no solicitaste esto, ignora este correo y tu contraseña permanecerá sin cambios.</p>
      <br>
      <p>Saludos,</p>
      <p><strong>El equipo de bikefy</strong></p>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendWelcomeEmail = async (email, name, temporaryPassword) => {
  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'bikefy - Bienvenido a nuestra plataforma',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0056b3;">¡Hola ${name}!</h2>
        <p>Bienvenido a bikefy. Esperamos que disfrutes de nuestros servicios.</p>
        <p>
          Tu contraseña temporal es:
          <span style="color: #0056b3; font-weight: bold;">${temporaryPassword}</span>
        </p>
        <p>Si tienes alguna duda o problema, no dudes en contactarnos.</p>
        <br>
        <p>Saludos,</p>
        <p><strong>El equipo de bikefy</strong></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
