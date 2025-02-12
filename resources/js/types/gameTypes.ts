import {DIFFICULTIES, GAME_MODES} from 'Constants/gameConsts'

export type TGameMode = typeof GAME_MODES[keyof typeof GAME_MODES]
export type TDifficulty = typeof DIFFICULTIES[keyof typeof DIFFICULTIES]