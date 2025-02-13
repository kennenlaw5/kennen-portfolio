import React from 'react'
import {TDifficulty, TGameMode} from 'JS/types/gameTypes'
import {DIFFICULTIES, GAME_MODES} from 'Constants/gameConsts'
import {useTicTacToeContext} from 'Components/TicTacToe/context/TicTacToeContext'
import {capitalize} from 'JS/helpers'

const ModeSelect: React.FC = () => {
    const {state, dispatch} = useTicTacToeContext()
    const {gameMode, difficulty, isGameActive} = state

    const updateGameMode = (value: TGameMode) => {
        dispatch({type: 'UPDATE_FIELD', payload: {field: 'gameMode', value}})
    }

    const setDifficulty = (value: TDifficulty) => {
        dispatch({type: 'UPDATE_FIELD', payload: {field: 'difficulty', value}})
    }

    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 text-center mb-6 gap-1">
        <div className="pb-2 xs:pb-0">
          <label className="mr-2 font-medium">Player Vs:</label>
          <select
            value={gameMode}
            onChange={({target: {value}}) => updateGameMode(value)}
            className="border p-1 rounded"
            disabled={isGameActive}
          >
            {Object.values(GAME_MODES).map((mode) => (
              <option key={mode} value={mode}>
                {capitalize(mode)}
              </option>
            ))}
          </select>
        </div>
        {gameMode === GAME_MODES.COMPUTER ? (
          <div>
            <label className="mr-2 font-medium">Difficulty:</label>
            <select
              value={difficulty}
              onChange={({target: {value}}) => setDifficulty(value)}
              className="border p-1 rounded"
              disabled={isGameActive}
            >
              {Object.values(DIFFICULTIES).map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {capitalize(difficulty)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
    )
}

export default ModeSelect
