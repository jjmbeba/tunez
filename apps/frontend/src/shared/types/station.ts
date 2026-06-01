import type { Station } from '@tunes/types'

export type PlayableStation = Pick<Station, 'id' | 'name' | 'streamUrl' | 'favicon'>
