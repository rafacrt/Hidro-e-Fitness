import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export interface JwtUser {
  id: string
  role: 'admin' | 'user'
  email?: string
}

export function signUserJWT(user: JwtUser) {
  const claims = {
    'x-hasura-allowed-roles': user.role === 'admin' ? ['admin', 'user'] : ['user'],
    'x-hasura-default-role': user.role === 'admin' ? 'admin' : 'user',
    'x-hasura-user-id': user.id,
  }

  const payload: jwt.JwtPayload = {
    sub: user.id,
    email: user.email,
    'https://hasura.io/jwt/claims': claims,
  }

  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '12h' })
}

export function verifyJWT(token: string) {
  return jwt.verify(token, JWT_SECRET)
}