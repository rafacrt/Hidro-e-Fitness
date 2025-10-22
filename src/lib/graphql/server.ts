import { cookies } from 'next/headers'
import { getGraphQLClient } from './client'

export function getGraphQLServerClient() {
  const token = cookies().get('token')?.value
  return getGraphQLClient(token)
}