import {DIFFICULTIES, GAME_MODES, GAMES} from 'Constants/gameConsts'

export type TGames = typeof GAMES[keyof typeof GAMES]
export type TGameMode = typeof GAME_MODES[keyof typeof GAME_MODES]
export type TDifficulty = typeof DIFFICULTIES[keyof typeof DIFFICULTIES]