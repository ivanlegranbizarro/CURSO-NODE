import { expressjwt } from 'express-jwt';

function jwt() {
  return expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      '/api/v1/users/login',
      '/api/v1/users/register',
      '/api/v1/users/get/count',
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (payload.isAdmin) {
    return done(null, false);
  }
  return done(null, true);
}

export default jwt;
