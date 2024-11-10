const jwt = require('jsonwebtoken');

const payload = {
  rut: '21.151.773-5',
  name_user: 'John Doe',
  email: 'john.doe@example.com',
  password_user: 'password',
  role_user: 'admin',
};

const secret =
  '1c793c3db047455133aecbee1a9910f38cddc48629282a8c0e841d9e594c9579';
const options = {
  expiresIn: '-1h', // Token expired 1 hour ago
};

const token = jwt.sign(payload, secret, options);
console.log(token);
