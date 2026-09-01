import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'smartexpense_super_secret_jwt_key_2026_production_quality';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d',
  });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'smartexpense_super_secret_jwt_key_2026_production_quality';
  return jwt.verify(token, secret);
};
