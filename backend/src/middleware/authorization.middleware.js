const jwt = require('jsonwebtoken');

const authorizationMiddleware = (authorizedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);

        return res.status(500).json({ message: 'Fallo al autenticar token' });
      }

      const userRole = decoded.role;

      if (!authorizedRoles.includes(userRole)) {
        return res.status(403).json({
          message: 'No tienes autorización para acceder a este recurso',
        });
      }

      req.user = decoded;
      next();
    });
  };
};

module.exports = authorizationMiddleware;
