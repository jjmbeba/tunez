import type { Station } from '@tunes/types'

export type PlayableStation = Pick<Station, 'id' | 'name' | 'streamUrl' | 'favicon'>

export type StationCardStation = PlayableStation & {
  tags?: string[]
  votes?: number
}
