// Game state
let board = [];
let currentPlayer = 'black';
let scores = { black: 2, white: 2 };
let gameActive = true;
let moveHistory = [];

// Initialize the game board
function initBoard() {
    board = [];
    
    // Initialize board array
    for (let i = 0; i < 8; i++) {
        board[i] = [];
        for (let j = 0; j < 8; j++) {
            board[i][j] = null;
        }
    }
    
    // Set initial pieces
    board[3][3] = 'white';
    board[3][4] = 'black';
    board[4][3] = 'black';
    board[4][4] = 'white';
    
    // Reset other game state
    currentPlayer = 'black';
    scores = { black: 2, white: 2 };
    gameActive = true;
    moveHistory = [];
}

// Check if a move is valid
function isValidMove(row, col, player) {
    // Cell must be empty
    if (board[row][col] !== null) return false;
    
    // Check in all 8 directions
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dx, dy] of directions) {
        if (checkDirection(row, col, dx, dy, player)) {
            return true;
        }
    }
    
    return false;
}

// Check a specific direction for valid move
function checkDirection(row, col, dx, dy, player) {
    let x = row + dx;
    let y = col + dy;
    let foundOpponent = false;
    
    // Check if we're still on the board
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        // If we find an empty cell, this direction is invalid
        if (board[x][y] === null) {
            return false;
        }
        
        // If we find our own color and we've found at least one opponent piece
        if (board[x][y] === player) {
            return foundOpponent;
        }
        
        // If we find opponent's color
        if (board[x][y] !== player) {
            foundOpponent = true;
        }
        
        x += dx;
        y += dy;
    }
    
    return false;
}

// Make a move
function makeMove(row, col, player) {
    // Place the disc
    board[row][col] = player;
    
    // Flip discs in all directions
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    let flippedDiscs = [];
    
    for (const [dx, dy] of directions) {
        if (checkDirection(row, col, dx, dy, player)) {
            flippedDiscs = flippedDiscs.concat(flipDirection(row, col, dx, dy, player));
        }
    }
    
    // Add to move history
    moveHistory.push({
        player: player,
        row: row,
        col: col,
        flipped: flippedDiscs
    });
    
    // Update scores
    updateScores();
    
    return flippedDiscs;
}

// Flip discs in a specific direction
function flipDirection(row, col, dx, dy, player) {
    const flipped = [];
    let x = row + dx;
    let y = col + dy;
    
    // Collect discs to flip
    while (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] !== player && board[x][y] !== null) {
        flipped.push({ row: x, col: y });
        x += dx;
        y += dy;
    }
    
    // Flip the discs
    for (const disc of flipped) {
        board[disc.row][disc.col] = player;
    }
    
    return flipped;
}

// Update scores
function updateScores() {
    scores.black = 0;
    scores.white = 0;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === 'black') {
                scores.black++;
            } else if (board[row][col] === 'white') {
                scores.white++;
            }
        }
    }
}

// Check if game is over
function checkGameEnd() {
    // Check if board is full
    let boardFull = true;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === null) {
                boardFull = false;
                break;
            }
        }
        if (!boardFull) break;
    }
    
    if (boardFull) {
        gameActive = false;
        return { gameOver: true, winner: getWinner() };
    }
    
    // Check if current player has valid moves
    if (!hasValidMoves(currentPlayer)) {
        // Switch to other player
        const otherPlayer = currentPlayer === 'black' ? 'white' : 'black';
        
        // Check if other player has valid moves
        if (!hasValidMoves(otherPlayer)) {
            // Game over - no valid moves for either player
            gameActive = false;
            return { gameOver: true, winner: getWinner() };
        } else {
            // Current player has no moves, so they pass
            currentPlayer = otherPlayer;
            return { gameOver: false, passed: true };
        }
    }
    
    return { gameOver: false };
}

// Get the winner of the game
function getWinner() {
    if (scores.black > scores.white) {
        return 'black';
    } else if (scores.white > scores.black) {
        return 'white';
    } else {
        return 'tie';
    }
}

// Check if player has valid moves
function hasValidMoves(player) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === null && isValidMove(row, col, player)) {
                return true;
            }
        }
    }
    return false;
}

// Switch to the next player
function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

// Getters for game state
function getBoard() {
    return board;
}

function getCurrentPlayer() {
    return currentPlayer;
}

function getScores() {
    return scores;
}

function getGameActive() {
    return gameActive;
}

function getMoveHistory() {
    return moveHistory;
}

// Setters for game state (for AI module)
function setCurrentPlayer(player) {
    currentPlayer = player;
}

function setGameActive(active) {
    gameActive = active;
}

// Export functions and state
export {
    // Game initialization
    initBoard,
    
    // Game logic
    isValidMove,
    makeMove,
    checkGameEnd,
    switchPlayer,
    hasValidMoves,
    
    // Getters
    getBoard,
    getCurrentPlayer,
    getScores,
    getGameActive,
    getMoveHistory,
    
    // Setters (for AI)
    setCurrentPlayer,
    setGameActive
};