const NextAuth = require('next-auth');
const Providers = require('next-auth/providers');
const User = require('../models/User');

const options = {
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const user = await User.findByEmail(credentials.email);
        if (user && await User.validatePassword(user, credentials.password)) {
          return { id: user.rut, name: user.name_user, email: user.email, role: user.role_user };
        }
        return null;
      }
    })
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    jwt: async (token, user) => {
      if (user) {
        token.id = user.rut;
        token.role = user.role_user;
      }
      return token;
    },
    session: async (session, token) => {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};

module.exports = (req, res) => NextAuth(req, res, options);
