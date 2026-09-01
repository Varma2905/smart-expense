import jwt from 'jsonwebtoken';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getSecret(), {
    expiresIn: '30d',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, getSecret());
};
