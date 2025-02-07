import {TBoard, TDifficulty, TPlayerLetter} from 'Components/TicTacToe/types/TicTacToeTypes'
import {DIFFICULTIES, WINNING_COMBOS} from 'Components/TicTacToe/constants/TicTacToeConstants'

export const getIsWinningMove = (board: TBoard, moveIndex: number) => {
    return WINNING_COMBOS
        .filter((combo) => combo.includes(moveIndex))
        .some(combo => combo.every(index => board[index] === board[combo[0]]))
}

const handleRandomMove = (board: TBoard): number => {
    let moveIndex = Math.floor(Math.random() * 9)

    // If random move is already taken, try again
    while (board[moveIndex]) {
        moveIndex = Math.floor(Math.random() * 9)
    }

    return moveIndex
}

export const getComputerMove = (board: TBoard, difficulty: TDifficulty, computerLetter: TPlayerLetter): number => {
    const moveCount = board.reduce(
        (prevValue, cell) => prevValue + (cell ? 1 : 0),
        0
    )

    if (moveCount <= 1 || difficulty === DIFFICULTIES.EASY) {
        return handleRandomMove(board)
    }

    const availableCombinations = WINNING_COMBOS.filter(combo => combo.some(index => !board[index]))

    // Check if computer can win (runs on normal difficulty)
    const winningMove = availableCombinations.find(combo => {
        // Check if computer has two moves in a combo and there is an empty cell
        const computerCount = combo.filter(index => board[index] === computerLetter).length
        const hasEmptyCell = combo.some(index => !board[index])

        return computerCount === 2 && hasEmptyCell
    })?.find(index => !board[index])

    // If computer can win, make that move
    if (typeof winningMove === 'number') {
        return winningMove
    }

    // Check if player can win (runs on normal difficulty)
    const losingMove = availableCombinations.find(combo => {
        // Check if player has two moves in a combo and there is an empty cell
        const playerCount = combo.filter(index => board[index] && board[index] !== computerLetter).length
        const hasEmptyCell = combo.some(index => !board[index])
        
        return playerCount === 2 && hasEmptyCell
    })?.find(index => !board[index])

    // If player can win, block them
    if (typeof losingMove === 'number') {
        return losingMove
    }

    // if (difficulty !== DIFFICULTIES.HARD) {
        return handleRandomMove(board)
    // }


    // return 0
}

// function onEdit2(e) {
//   //Created By Kennen Lawrence
//   const {range, value} = e
//   const activeSheet = range.getSheet()

//   const boardRange = activeSheet.getRange(5,2,3,3);
//   const versus = activeSheet.getRange(2,3).getValue();

//   if (versus !== 'Computer') {
//     handlePvpMove(activeSheet)

//     return
//   }


//   const board = boardRange.getValues()
//   Logger.log(board)
//   const count = board.reduce(
//     (prevValue, row) => prevValue + row.reduce(
//       (rowValue, column) => (column ? rowValue + 1 : rowValue),
//       0
//     ),
//     0
//   )
//   Logger.log(`Count: ${count}`)

//   if (!count) {
//     Logger.log("Empty");

//     return
//   }


//   const userC = user.getColumn() - 2
//   const userR = user.getRow() - 5
//   let aiC = userC
//   let aiR = userR
//   const userTeamCheckRange = activeSheet.getRange(1, 1)
//   const userTeamCheck = userTeamCheckRange.getValue()
//   const aiTeam = userTeamCheck === 'X' ? 'O' : 'X'

//   // If there is only one move, just play a random square
//   if (count === 1) {
//     // If random move is same as user, try again
//     while (aiC == userC && aiR == userR) {
//       aiC = Math.floor(Math.random() * 3);
//       aiR = Math.floor(Math.random() * 3);
//     }

//     board[aiR][aiC] = aiTeam;
//     range.setValues(board);
//     userTeamCheckRange.setValue(userTeam);

//     return
//   }

//   // Prevent cheating if user plays as other character
//   if (userTeam !== userTeamCheck) {
//     board[aiR][aiC] = userTeamCheck;
//   }

//   var uTwo=[[0,0],[0,0],[0,0],[0,0]]
//   var aTwo=[[0,0],[0,0],[0,0],[0,0]]

//   // Check for user and AI score
//   for (i = 0; i < 3; i++) {
//     for (j = 0; j < 3; j++) {
//       if (board[i][j] === userTeamCheck) { uTwo[i][0]++ } // across row
//       if (board[j][i] === userTeamCheck) { uTwo[i][1]++ } // down column
//       if (board[i][j] === aiTeam) { aTwo[i][0]++ } // across row
//       if (board[j][i] === aiTeam) { aTwo[i][1]++ } // down column
//     }

//     if (uTwo[i][0] === 3 || uTwo[i][1] === 3) {
//       handleEndGame('user')

//       return
//     }
//   }

//   for (i = 0; i < 3; i++) {
//     for (var k = 0; k < 3; k++) {
//       if (aTwo[i][0] === 2 && !uTwo[i][0] && !board[i][k]) {
//         handleAiWon(aiTeam, i, k, range, board)

//         return
//       }

//       if (aTwo[i][1] === 2 && !uTwo[i][1] && !board[k][i]) {
//         handleAiWon(aiTeam, k, i, range, board)

//         return
//       }
//     }
//   }

//   // Check Diagnals
//   j = 3;
//   for (i = 0; i < 3; i++) {
//     j--;
//     if (board[i][i] === userTeamCheck) { uTwo[3][0]++ }
//     if (board[i][j] === userTeamCheck) { uTwo[3][1]++ }
//     if (board[i][i] === aiTeam) { aTwo[3][0]++; }
//     if (board[i][j] === aiTeam) { aTwo[3][1]++ }
//   }

//   if (uTwo[3][0] === 3 || uTwo[3][1] === 3) {
//     handleEndGame('user')

//     return
//   }

//   if (aTwo[3][0] === 2 && uTwo[3][0] === 0) {
//     for (var k = 0; k < 3; k++) {
//       if (!board[k][k]) {
//         handleAiWon(aiTeam, k, k, range, board)

//         return
//       }
//     }
//   }

//   if (aTwo[3][1] === 2 && !uTwo[3][1]) {
//     j = 3
//     for (var k = 0; k < 3; k++) {
//       j--
//       if (!board[k][j]) {
//         handleAiWon(aiTeam, k, j, range, board)

//         return
//       }
//     }
//   }

//   if (uTwo[3][0] === 2 && !aTwo[3][0]) {
//     for (var k = 0; k < 3; k++) {
//       if (board[k][k]) {
//         continue
//       }

//       board[k][k] = aiTeam
//       range.setValues(board)

//       return
//     }
//   }

//   if (uTwo[3][1] === 2 && !aTwo[3][1]) {
//     j = 3
//     for (var k = 0; k < 3; k++) {
//       j--
//       if (board[k][j]) {
//         continue
//       }

//       board[k][j] = aiTeam
//       range.setValues(board)

//       return
//     }
//   }

//   for (i = 0;i < 3; i++) {
//     if (uTwo[i][0] == 3 || uTwo[i][1] == 3) {
//       handleEndGame('user')

//       return
//     }

//     if (uTwo[i][0] == 2 && !aTwo[i][0]) {
//       for (var k = 0; k < 3; k++) {
//         if (!board[i][k]) {
//           board[i][k] = aiTeam
//           range.setValues(board)
  
//           return
//         }
//       }
//     }

//     if (uTwo[i][1] == 2 && aTwo[i][1] == 0) {
//       for (var k = 0; k < 3; k++) {
//         if (!board[k][i]) {
//           board[k][i] = aiTeam
//           range.setValues(board)

//           return
//         }
//       }
//     }
//   }

//   if (count === 9) {
//     handleEndGame('tie')
//   }

//   for (i = 0; i < 3; i++) {
//     if (!uTwo[i][0] && aTwo[i][0]) {
//       for (var k = 0; k < 3; k++) {
//         if (!board[i][k]) {
//           board[i][k] = aiTeam
//           range.setValues(board)

//           return
//         }
//       }
//     }

//     if (!uTwo[i][1] && aTwo[i][1]) {
//       for (var k = 0; k < 3; k++) {
//         if (!board[k][i]) {
//           board[k][i] = aiTeam
//           range.setValues(board)

//           return
//         }
//       }
//     }
//   }

//   if (aTwo[3][0] && !uTwo[3][0]) {
//     for (var k = 0; k < 3; k++) {
//       if (board[k][k]) {
//         continue
//       }

//       handleAiWon(aiTeam, k, k, range, board)

//       return
//     }
//   }

//   if (aTwo[3][1] && !uTwo[3][1]) {
//     j = 3
//     for (var k = 0; k < 3; k++) {
//       j--
//       if (!board[k][j]) {
//         board[k][j] = aiTeam
//         range.setValues(board)
//         range.getValues()

//         return
//       }
//     }
//   }

//   aiC = userC
//   aiR = userR

//   while(board[aiR][aiC]) {
//     aiC = Math.floor(Math.random() * 3);
//     aiR = Math.floor(Math.random() * 3);
//   }

//   board[aiR][aiC] = aiTeam;
//   range.setValues(board);

//   return
// }

// const handlePvpMove = (sheet) => {
//     const winner = sheet.getRange(3,2).getValue()?.split(' ')?.[1]

//     if (winner) {
//       PvP(winner)
//     }
// }

// const handleAiWon = (aiTeam, rowIndex, columnIndex, boardRange, boardData) => {
//   boardData[rowIndex][columnIndex] = aiTeam
//   boardRange.setValues(boardData)

//   handleEndGame('ai')
// }

// const handleEndGame = (winner) => {
//   const options = {
//     tie: {
//       row: 7,
//       message: 'You have tied against the computer! The board will reset upon closing this notification!',
//       title: 'TIE!'
//     },
//     user: {
//       row: 6,
//       message: 'You have won this match against the computer! The board will reset upon closing this notification!',
//       title: 'You Won!',
//     },
//     ai: {
//       row: 5,
//       message: 'The computer has won this match! The board will reset upon closing this notification!',
//       title: 'You Lost!',
//     },
//   }

//   ui.alert(
//     options[winner].title,
//     options[winner].message,
//     ui.ButtonSet.OK
//   );

//   const range = SpreadsheetApp
//     .getActiveSpreadsheet()
//     .getSheetByName('Shhhhh....')
//     .getRange(options[winner].row, 1)

//   range.setValue(range.getValue() + 1)

//   boardClear()
// }

// const PvP = (winner) => {
//   var ui = SpreadsheetApp.getUi()

//   ui.alert(
//     `Player ${winner} won!`,
//     `Player ${winner}! You have won this match! The board will reset upon closing this notification!`,
//     ui.ButtonSet.OK
//   )

//   boardClear()
// }