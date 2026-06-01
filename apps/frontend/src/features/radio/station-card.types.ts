import type { PlayableStation } from '@/shared/types/station'

export type StationCardStation = PlayableStation & {
  tags?: string[]
  votes?: number
}
