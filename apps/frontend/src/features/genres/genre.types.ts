export type GenreId = 'benga' | 'gengetone' | 'afro-pop' | 'genge' | 'taarab' | 'bongo-flava'

export interface GenreDefinition {
  id: GenreId
  name: string
  description: string
  heroCopy: string
  heroLabels: string[]
  accentColor: string
  accentColorSoft: string
  featuredArtists: string[]
  relatedGenreIds: GenreId[]
  tagAliases: string[]
}
