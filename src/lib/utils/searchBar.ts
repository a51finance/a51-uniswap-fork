import { SearchToken } from 'graphql/data/SearchTokens'

/**
 * @param tokenResults array of FungibleToken results
 * @returns an array of Fungible Tokens
 */
export function organizeSearchResults(tokenResults: SearchToken[]): SearchToken[] {
  return tokenResults?.slice(0, 5) ?? []
}
