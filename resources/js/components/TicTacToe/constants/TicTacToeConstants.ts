export const PLAYER_LETTERS = {
    X: 'X',
    O: 'O',
}
export const GAME_MODES = {
    COMPUTER: 'computer',
    PERSON: 'person',
}
export const DIFFICULTIES = {
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard',
}
export const BOARD_POSITIONS = {
    TOP_LEFT: 0,
    TOP_CENTER: 1,
    TOP_RIGHT: 2,
    MIDDLE_LEFT: 3,
    MIDDLE_CENTER: 4,
    MIDDLE_RIGHT: 5,
    BOTTOM_LEFT: 6,
    BOTTOM_CENTER: 7,
    BOTTOM_RIGHT: 8,
}

const {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    MIDDLE_LEFT,
    MIDDLE_CENTER,
    MIDDLE_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT
} = BOARD_POSITIONS

export const WINNING_COMBOS = {
    ROWS: [
        [TOP_LEFT, TOP_CENTER, TOP_RIGHT],
        [MIDDLE_LEFT, MIDDLE_CENTER, MIDDLE_RIGHT],
        [BOTTOM_LEFT, BOTTOM_CENTER, BOTTOM_RIGHT],
    ],
    COLUMNS: [
        [TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT],
        [TOP_CENTER, MIDDLE_CENTER, BOTTOM_CENTER],
        [TOP_RIGHT, MIDDLE_RIGHT, BOTTOM_RIGHT],
    ],
    DIAGONALS: [
        [TOP_LEFT, MIDDLE_CENTER, BOTTOM_RIGHT],
        [TOP_RIGHT, MIDDLE_CENTER, BOTTOM_LEFT],
    ],
}