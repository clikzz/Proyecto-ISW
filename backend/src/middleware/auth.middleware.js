const { getSession } = require('next-auth/react');

const authMiddleware = async (req, res, next) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  req.user = session.user;
  next();
};

module.exports = authMiddleware;
