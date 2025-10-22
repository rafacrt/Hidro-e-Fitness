import { cookies } from 'next/headers'
import { verifyJWT } from './jwt'

export function getServerUser() {
  const token = cookies().get('token')?.value
  if (!token) return null
  try {
    const payload = verifyJWT(token) as any
    const claims = payload['https://hasura.io/jwt/claims'] || {}
    return {
      id: claims['x-hasura-user-id'] || payload.sub,
      role: claims['x-hasura-default-role'] || 'user',
      email: payload.email,
    }
  } catch {
    return null
  }
}