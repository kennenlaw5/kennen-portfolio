(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_pages_Games_tsx"],{

/***/ "./resources/js/components/TicTacToe/Board.tsx":
/*!*****************************************************!*\
  !*** ./resources/js/components/TicTacToe/Board.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/TicTacToe/context/TicTacToeContext */ "./resources/js/components/TicTacToe/context/TicTacToeContext.tsx");



const Board = () => {
    const { state, dispatch } = (0,Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_2__.useTicTacToeContext)();
    const { board } = state;
    const boardCellClass = 'flex items-center justify-center border border-blue-700 hover:bg-blue-50 transition-colors';
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex justify-center" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "w-64 h-64 bg-white shadow-lg rounded-lg overflow-hidden" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "grid grid-cols-3 grid-rows-3 h-full" }, board.map((cell, index) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { key: index, className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(boardCellClass, {
                    'cursor-pointer': !cell,
                    'cursor-not-allowed': cell,
                }), onClick: () => dispatch({ type: 'MAKE_PLAYER_MOVE', index }) },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-3xl font-bold" }, cell))))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Board);


/***/ }),

/***/ "./resources/js/components/TicTacToe/BoardHelper.tsx":
/*!***********************************************************!*\
  !*** ./resources/js/components/TicTacToe/BoardHelper.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/constants/TicTacToeConstants */ "./resources/js/components/TicTacToe/constants/TicTacToeConstants.ts");
/* harmony import */ var Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/TicTacToe/context/TicTacToeContext */ "./resources/js/components/TicTacToe/context/TicTacToeContext.tsx");
/* harmony import */ var Components_TicTacToe_GameResult__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Components/TicTacToe/GameResult */ "./resources/js/components/TicTacToe/GameResult.tsx");
/* harmony import */ var Components_TicTacToe_TurnTracker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! Components/TicTacToe/TurnTracker */ "./resources/js/components/TicTacToe/TurnTracker.tsx");





const BoardHelper = () => {
    const { state, dispatch } = (0,Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_2__.useTicTacToeContext)();
    const { gameMode, currentTurn, isGameActive, isBoardFull, winner } = state;
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex flex-col items-center mb-4" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_GameResult__WEBPACK_IMPORTED_MODULE_3__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_TurnTracker__WEBPACK_IMPORTED_MODULE_4__["default"], null),
        !isGameActive && gameMode === Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.GAME_MODES.COMPUTER ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-sm text-center" }, "Either click a cell to play first, or press \"Start\" to let the computer begin."),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => dispatch({ type: 'MAKE_COMPUTER_MOVE' }), className: "bg-blue-500 text-white px-3 py-1 rounded mt-2 hover:bg-blue-600 transition-colors" }, "Start"))) : null,
        !isGameActive && gameMode !== Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.GAME_MODES.COMPUTER ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-gray-400 text-sm text-center" }, "Awaiting game...")) : null));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BoardHelper);


/***/ }),

/***/ "./resources/js/components/TicTacToe/GameResult.tsx":
/*!**********************************************************!*\
  !*** ./resources/js/components/TicTacToe/GameResult.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_WinnerAnnouncement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/WinnerAnnouncement */ "./resources/js/components/TicTacToe/WinnerAnnouncement.tsx");
/* harmony import */ var Components_TicTacToe_TieAnnouncement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/TicTacToe/TieAnnouncement */ "./resources/js/components/TicTacToe/TieAnnouncement.tsx");



const GameResult = () => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_WinnerAnnouncement__WEBPACK_IMPORTED_MODULE_1__["default"], null),
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_TieAnnouncement__WEBPACK_IMPORTED_MODULE_2__["default"], null)));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameResult);


/***/ }),

/***/ "./resources/js/components/TicTacToe/LetterSelect.tsx":
/*!************************************************************!*\
  !*** ./resources/js/components/TicTacToe/LetterSelect.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/constants/TicTacToeConstants */ "./resources/js/components/TicTacToe/constants/TicTacToeConstants.ts");
/* harmony import */ var _context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./context/TicTacToeContext */ "./resources/js/components/TicTacToe/context/TicTacToeContext.tsx");



const LetterSelect = () => {
    const { state, dispatch } = (0,_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_2__.useTicTacToeContext)();
    const { gameMode, isGameActive, playerLetter } = state;
    const letterSelectLabel = gameMode === 'computer'
        ? 'Choose your letter:'
        : 'Who is going first?';
    return !isGameActive ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex items-center space-x-4" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex items-center" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { className: "mr-2 font-medium" }, letterSelectLabel),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("select", { value: playerLetter, onChange: ({ target: { value } }) => dispatch({ type: 'SET_PLAYER_LETTER', payload: value }), className: "border p-1 rounded" },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.X }, Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.X),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.O }, Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.O))))) : null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LetterSelect);


/***/ }),

/***/ "./resources/js/components/TicTacToe/ModeSelect.tsx":
/*!**********************************************************!*\
  !*** ./resources/js/components/TicTacToe/ModeSelect.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/constants/TicTacToeConstants */ "./resources/js/components/TicTacToe/constants/TicTacToeConstants.ts");
/* harmony import */ var Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/TicTacToe/context/TicTacToeContext */ "./resources/js/components/TicTacToe/context/TicTacToeContext.tsx");



const ModeSelect = () => {
    const { state, dispatch } = (0,Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_2__.useTicTacToeContext)();
    const { gameMode, difficulty, isGameActive } = state;
    const updateGameMode = (value) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { field: 'gameMode', value } });
    };
    const setDifficulty = (value) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { field: 'difficulty', value } });
    };
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex flex-wrap items-center mb-6 space-x-4" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { className: "mr-2 font-medium" }, "Player Vs:"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("select", { value: gameMode, onChange: ({ target: { value } }) => updateGameMode(value), className: "border p-1 rounded", disabled: isGameActive },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.GAME_MODES.COMPUTER }, "Computer"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.GAME_MODES.PERSON }, "Person"))),
        gameMode === Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.GAME_MODES.COMPUTER ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { className: "mr-2 font-medium" }, "Difficulty:"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("select", { value: difficulty, onChange: ({ target: { value } }) => setDifficulty(value), className: "border p-1 rounded", disabled: isGameActive },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.DIFFICULTIES.EASY }, "Easy"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.DIFFICULTIES.NORMAL }, "Normal"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.DIFFICULTIES.HARD }, "Hard")))) : null));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModeSelect);


/***/ }),

/***/ "./resources/js/components/TicTacToe/ResetButton.tsx":
/*!***********************************************************!*\
  !*** ./resources/js/components/TicTacToe/ResetButton.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/context/TicTacToeContext */ "./resources/js/components/TicTacToe/context/TicTacToeContext.tsx");


const ResetButton = () => {
    const { state: { isGameActive }, dispatch } = (0,Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_1__.useTicTacToeContext)();
    return isGameActive ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => dispatch({ type: 'RESET_GAME' }), className: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors" }, "Reset")) : null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ResetButton);


/***/ }),

/***/ "./resources/js/components/TicTacToe/TicTacToe.tsx":
/*!*********************************************************!*\
  !*** ./resources/js/components/TicTacToe/TicTacToe.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_LetterSelect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/LetterSelect */ "./resources/js/components/TicTacToe/LetterSelect.tsx");
/* harmony import */ var Components_TicTacToe_Board__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/TicTacToe/Board */ "./resources/js/components/TicTacToe/Board.tsx");
/* harmony import */ var Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Components/TicTacToe/context/TicTacToeContext */ "./resources/js/components/TicTacToe/context/TicTacToeContext.tsx");
/* harmony import */ var Components_TicTacToe_ResetButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! Components/TicTacToe/ResetButton */ "./resources/js/components/TicTacToe/ResetButton.tsx");
/* harmony import */ var Components_TicTacToe_ModeSelect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! Components/TicTacToe/ModeSelect */ "./resources/js/components/TicTacToe/ModeSelect.tsx");
/* harmony import */ var Components_TicTacToe_BoardHelper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! Components/TicTacToe/BoardHelper */ "./resources/js/components/TicTacToe/BoardHelper.tsx");







const TicTacToe = () => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_3__.TicTacToeProvider, null,
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "p-8" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_ModeSelect__WEBPACK_IMPORTED_MODULE_5__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_BoardHelper__WEBPACK_IMPORTED_MODULE_6__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_Board__WEBPACK_IMPORTED_MODULE_2__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex justify-center mt-4" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_LetterSelect__WEBPACK_IMPORTED_MODULE_1__["default"], null),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_ResetButton__WEBPACK_IMPORTED_MODULE_4__["default"], null)))));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TicTacToe);


/***/ }),

/***/ "./resources/js/components/TicTacToe/TieAnnouncement.tsx":
/*!***************************************************************!*\
  !*** ./resources/js/components/TicTacToe/TieAnnouncement.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/context/TicTacToeContext */ "./resources/js/components/TicTacToe/context/TicTacToeContext.tsx");


const TieAnnouncement = () => {
    const { state, dispatch } = (0,Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_1__.useTicTacToeContext)();
    const { winner, isBoardFull } = state;
    return !winner && isBoardFull ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-xl font-semibold" }, "Better luck next time!"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-4xl font-bold" }, "Tied Game!"))) : null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TieAnnouncement);


/***/ }),

/***/ "./resources/js/components/TicTacToe/TurnTracker.tsx":
/*!***********************************************************!*\
  !*** ./resources/js/components/TicTacToe/TurnTracker.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/context/TicTacToeContext */ "./resources/js/components/TicTacToe/context/TicTacToeContext.tsx");


const TurnTracker = () => {
    const { state, dispatch } = (0,Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_1__.useTicTacToeContext)();
    const { isGameActive, winner, isBoardFull, currentTurn } = state;
    return isGameActive && !isBoardFull && !winner ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-xl font-semibold" }, "Turn"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-4xl font-bold" }, currentTurn))) : null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TurnTracker);


/***/ }),

/***/ "./resources/js/components/TicTacToe/WinnerAnnouncement.tsx":
/*!******************************************************************!*\
  !*** ./resources/js/components/TicTacToe/WinnerAnnouncement.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/constants/TicTacToeConstants */ "./resources/js/components/TicTacToe/constants/TicTacToeConstants.ts");
/* harmony import */ var Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/TicTacToe/context/TicTacToeContext */ "./resources/js/components/TicTacToe/context/TicTacToeContext.tsx");



const WinnerAnnouncement = () => {
    const { state, dispatch } = (0,Components_TicTacToe_context_TicTacToeContext__WEBPACK_IMPORTED_MODULE_2__.useTicTacToeContext)();
    const { gameMode, winner, playerLetter } = state;
    const getWinnerText = () => {
        if (gameMode !== Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.GAME_MODES.COMPUTER) {
            return winner;
        }
        return winner === playerLetter ? 'You' : 'The Computer';
    };
    return winner ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-xl font-semibold" }, "Better luck next time!"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-4xl font-bold" },
            getWinnerText(),
            " Won!"))) : null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WinnerAnnouncement);


/***/ }),

/***/ "./resources/js/components/TicTacToe/constants/TicTacToeConstants.ts":
/*!***************************************************************************!*\
  !*** ./resources/js/components/TicTacToe/constants/TicTacToeConstants.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DIFFICULTIES: () => (/* binding */ DIFFICULTIES),
/* harmony export */   GAME_MODES: () => (/* binding */ GAME_MODES),
/* harmony export */   PLAYER_LETTERS: () => (/* binding */ PLAYER_LETTERS),
/* harmony export */   WINNING_COMBOS: () => (/* binding */ WINNING_COMBOS)
/* harmony export */ });
const PLAYER_LETTERS = {
    X: 'X',
    O: 'O',
};
const GAME_MODES = {
    COMPUTER: 'computer',
    PERSON: 'person',
};
const DIFFICULTIES = {
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard',
};
const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];


/***/ }),

/***/ "./resources/js/components/TicTacToe/context/TicTacToeContext.tsx":
/*!************************************************************************!*\
  !*** ./resources/js/components/TicTacToe/context/TicTacToeContext.tsx ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TicTacToeProvider: () => (/* binding */ TicTacToeProvider),
/* harmony export */   useTicTacToeContext: () => (/* binding */ useTicTacToeContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/constants/TicTacToeConstants */ "./resources/js/components/TicTacToe/constants/TicTacToeConstants.ts");
/* harmony import */ var Components_TicTacToe_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/TicTacToe/helpers */ "./resources/js/components/TicTacToe/helpers.ts");



const initialState = {
    gameMode: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.GAME_MODES.COMPUTER,
    difficulty: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.DIFFICULTIES.NORMAL,
    playerLetter: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.X,
    currentTurn: Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.X,
    board: Array(9).fill(''),
    isGameActive: false,
    winner: null,
    isBoardFull: false,
};
const getIsBoardFull = (board) => board.every(cell => cell);
const makePlayerMove = (state, action) => {
    const { index } = action;
    if (state.board[index] !== '' || state.winner) {
        return state;
    }
    const newBoard = [...state.board];
    newBoard[index] = state.currentTurn;
    if ((0,Components_TicTacToe_helpers__WEBPACK_IMPORTED_MODULE_2__.getIsWinningMove)(newBoard, index)) {
        return Object.assign(Object.assign({}, state), { board: newBoard, winner: state.currentTurn });
    }
    const isBoardFull = getIsBoardFull(newBoard);
    if (state.gameMode !== Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.GAME_MODES.COMPUTER || isBoardFull) {
        return Object.assign(Object.assign({}, state), { board: newBoard, currentTurn: state.currentTurn === Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.X ? Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.O : Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.X, isGameActive: true, isBoardFull });
    }
    return makeComputerMove(Object.assign(Object.assign({}, state), { board: newBoard }));
};
const makeComputerMove = (state) => {
    const computerLetter = state.playerLetter === Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.X ? Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.O : Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_1__.PLAYER_LETTERS.X;
    const computerMoveIndex = (0,Components_TicTacToe_helpers__WEBPACK_IMPORTED_MODULE_2__.getComputerMove)(state.board, state.difficulty, computerLetter);
    const newBoard = [...state.board];
    newBoard[computerMoveIndex] = computerLetter;
    const isBoardFull = getIsBoardFull(newBoard);
    const newState = Object.assign(Object.assign({}, state), { board: newBoard, isBoardFull, isGameActive: true });
    return (0,Components_TicTacToe_helpers__WEBPACK_IMPORTED_MODULE_2__.getIsWinningMove)(newBoard, computerMoveIndex)
        ? Object.assign(Object.assign({}, newState), { winner: computerLetter }) : newState;
};
const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return Object.assign(Object.assign({}, state), { [action.payload.field]: action.payload.value });
        case 'SET_PLAYER_LETTER':
            return Object.assign(Object.assign({}, state), { playerLetter: action.payload, currentTurn: action.payload });
        case 'START_GAME':
            return Object.assign(Object.assign({}, state), { isGameActive: true });
        case 'RESET_GAME':
            return Object.assign(Object.assign({}, state), { board: Array(9).fill(''), isGameActive: false, currentTurn: state.playerLetter, winner: null, isBoardFull: false });
        case 'MAKE_PLAYER_MOVE':
            return makePlayerMove(state, action);
        case 'MAKE_COMPUTER_MOVE':
            return makeComputerMove(state);
        default:
            return state;
    }
};
const TicTacToeContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(undefined);
const useTicTacToeContext = () => {
    const context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(TicTacToeContext);
    if (!context) {
        throw new Error('useTicTacToe must be used within a TicTacToeProvider');
    }
    return context;
};
const TicTacToeProvider = ({ children }) => {
    const [state, dispatch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(reducer, initialState);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(TicTacToeContext.Provider, { value: { state, dispatch } }, children));
};


/***/ }),

/***/ "./resources/js/components/TicTacToe/helpers.ts":
/*!******************************************************!*\
  !*** ./resources/js/components/TicTacToe/helpers.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputerMove: () => (/* binding */ getComputerMove),
/* harmony export */   getIsWinningMove: () => (/* binding */ getIsWinningMove)
/* harmony export */ });
/* harmony import */ var Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Components/TicTacToe/constants/TicTacToeConstants */ "./resources/js/components/TicTacToe/constants/TicTacToeConstants.ts");

const getIsWinningMove = (board, moveIndex) => {
    return Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_0__.WINNING_COMBOS
        .filter((combo) => combo.includes(moveIndex))
        .some(combo => combo.every(index => board[index] === board[combo[0]]));
};
const handleRandomMove = (board) => {
    let moveIndex = Math.floor(Math.random() * 9);
    // If random move is already taken, try again
    while (board[moveIndex]) {
        moveIndex = Math.floor(Math.random() * 9);
    }
    return moveIndex;
};
const getComputerMove = (board, difficulty, computerLetter) => {
    var _a, _b;
    const moveCount = board.reduce((prevValue, cell) => prevValue + (cell ? 1 : 0), 0);
    if (moveCount <= 1 || difficulty === Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_0__.DIFFICULTIES.EASY) {
        return handleRandomMove(board);
    }
    const availableCombinations = Components_TicTacToe_constants_TicTacToeConstants__WEBPACK_IMPORTED_MODULE_0__.WINNING_COMBOS.filter(combo => combo.some(index => !board[index]));
    // Check if computer can win (runs on normal difficulty)
    const winningMove = (_a = availableCombinations.find(combo => {
        // Check if computer has two moves in a combo and there is an empty cell
        const computerCount = combo.filter(index => board[index] === computerLetter).length;
        const hasEmptyCell = combo.some(index => !board[index]);
        return computerCount === 2 && hasEmptyCell;
    })) === null || _a === void 0 ? void 0 : _a.find(index => !board[index]);
    // If computer can win, make that move
    if (typeof winningMove === 'number') {
        return winningMove;
    }
    // Check if player can win (runs on normal difficulty)
    const losingMove = (_b = availableCombinations.find(combo => {
        // Check if player has two moves in a combo and there is an empty cell
        const playerCount = combo.filter(index => board[index] && board[index] !== computerLetter).length;
        const hasEmptyCell = combo.some(index => !board[index]);
        return playerCount === 2 && hasEmptyCell;
    })) === null || _b === void 0 ? void 0 : _b.find(index => !board[index]);
    // If player can win, block them
    if (typeof losingMove === 'number') {
        return losingMove;
    }
    // if (difficulty !== DIFFICULTIES.HARD) {
    return handleRandomMove(board);
    // }
    // return 0
};
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


/***/ }),

/***/ "./resources/js/pages/Games.tsx":
/*!**************************************!*\
  !*** ./resources/js/pages/Games.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_TicTacToe_TicTacToe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/TicTacToe/TicTacToe */ "./resources/js/components/TicTacToe/TicTacToe.tsx");
/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-icons/fa */ "./node_modules/react-icons/fa/index.mjs");



// @todo: Refactor this file
// Placeholder Go component
const GoGame = () => {
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", { className: "text-2xl font-bold mb-4" }, "GO"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", { className: "text-gray-600" }, "GO game coming soon...")));
};
const Games = () => {
    const [selectedGame, setSelectedGame] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('none');
    // Handler to go back to game selection
    const handleBack = () => {
        setSelectedGame('none');
    };
    // If a game is selected, render that game with a header that includes a back arrow.
    if (selectedGame !== 'none') {
        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", { className: "p-8" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex items-center mb-4" },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: handleBack, className: "mr-2 text-blue-600 hover:text-blue-800" },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_2__.FaArrowLeft, { size: 20 })),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", { className: "text-3xl font-bold" }, selectedGame === 'ticTacToe' ? 'Tic Tac Toe' : 'GO')),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, selectedGame === 'ticTacToe' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_TicTacToe_TicTacToe__WEBPACK_IMPORTED_MODULE_1__["default"], null) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(GoGame, null))));
    }
    // Otherwise, render the game selection buttons.
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", { className: "p-8" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", { className: "text-3xl font-bold mb-6" }, "Games"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => setSelectedGame('ticTacToe'), className: "bg-blue-100 hover:scale-105 transition-transform p-6 rounded-lg shadow focus:outline-none" },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex flex-col items-center" },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", { src: "/svg/tic-tac-toe.svg", alt: "Tic-Tac-Toe Logo", className: "w-16 h-16 object-contain" }),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-lg font-medium" }, "Tic Tac Toe"))),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => setSelectedGame('go'), className: "bg-blue-100 hover:scale-105 transition-transform p-6 rounded-lg shadow focus:outline-none" },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex flex-col items-center" },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "bg-blue-300 h-16 w-16 mb-4 rounded-full flex items-center justify-center" },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-white font-bold" }, "G")),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-lg font-medium" }, "GO"))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Games);


/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ })

}]);
//# sourceMappingURL=resources_js_pages_Games_tsx.js.map