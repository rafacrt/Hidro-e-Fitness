import { GraphQLClient } from 'graphql-request'

export function getGraphQLClient(token?: string) {
  const endpoint = process.env.HASURA_GRAPHQL_ENDPOINT!
  const headers: Record<string, string> = {}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  } else if (process.env.HASURA_ADMIN_SECRET) {
    headers['x-hasura-admin-secret'] = process.env.HASURA_ADMIN_SECRET!
  }

  return new GraphQLClient(endpoint, { headers })
}