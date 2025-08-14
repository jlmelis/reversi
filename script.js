// Game state
let board = [];
let currentPlayer = 'black';
let scores = { black: 2, white: 2 };
let gameActive = true;
let moveHistory = [];
let aiEnabled = false;
let aiDifficulty = 'medium';

// DOM elements
const boardElement = document.getElementById('board');
const blackScoreElement = document.getElementById('black-score');
const whiteScoreElement = document.getElementById('white-score');
const currentPlayerElement = document.getElementById('current-player');
const gameStatusElement = document.getElementById('game-status');
const moveHistoryList = document.getElementById('move-history-list');
const restartButton = document.getElementById('restart-btn');
const aiToggle = document.getElementById('ai-toggle');
const difficultySelect = document.getElementById('difficulty');

// Initialize the game
function initGame() {
    createBoard();
    setupEventListeners();
    updateUI();
}

// Create the game board
function createBoard() {
    board = [];
    boardElement.innerHTML = '';
    
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
    
    // Create board cells
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Add disc if exists
            if (board[row][col]) {
                const disc = document.createElement('div');
                disc.className = `disc ${board[row][col]}`;
                cell.appendChild(disc);
            }
            
            boardElement.appendChild(cell);
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    // Cell click event
    boardElement.addEventListener('click', handleCellClick);
    
    // Restart button
    restartButton.addEventListener('click', initGame);
    
    // AI toggle
    aiToggle.addEventListener('change', function() {
        aiEnabled = this.checked;
        difficultySelect.disabled = !aiEnabled;
        if (aiEnabled && currentPlayer === 'white') {
            setTimeout(makeAIMove, 500); // Small delay for better UX
        }
    });
    
    // Difficulty change
    difficultySelect.addEventListener('change', function() {
        aiDifficulty = this.value;
    });
}

// Handle cell click
function handleCellClick(event) {
    if (!gameActive) return;
    
    const cell = event.target.closest('.cell');
    if (!cell) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    // Check if it's a valid move
    if (isValidMove(row, col, currentPlayer)) {
        makeMove(row, col);
        
        // Check if game should continue
        if (gameActive) {
            // If playing against AI and it's AI's turn
            if (aiEnabled && currentPlayer === 'white') {
                setTimeout(makeAIMove, 500); // Small delay for better UX
            }
        }
    }
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
function makeMove(row, col) {
    // Place the disc
    board[row][col] = currentPlayer;
    
    // Flip discs in all directions
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    let flippedDiscs = [];
    
    for (const [dx, dy] of directions) {
        if (checkDirection(row, col, dx, dy, currentPlayer)) {
            flippedDiscs = flippedDiscs.concat(flipDirection(row, col, dx, dy, currentPlayer));
        }
    }
    
    // Add to move history
    moveHistory.push({
        player: currentPlayer,
        row: row,
        col: col,
        flipped: flippedDiscs
    });
    
    // Update scores
    updateScores();
    
    // Switch player
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    
    // Update UI
    updateUI();
    
    // Check if game is over
    checkGameEnd();
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
        const winner = scores.black > scores.white ? 'Black' : scores.white > scores.black ? 'White' : 'Tie';
        gameStatusElement.textContent = boardFull ? 
            `Game Over! ${winner === 'Tie' ? 'Tie Game!' : winner + ' wins!'}` : 
            'Game Over!';
        return;
    }
    
    // Check if current player has valid moves
    if (!hasValidMoves(currentPlayer)) {
        // Switch to other player
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        
        // Check if other player has valid moves
        if (!hasValidMoves(currentPlayer)) {
            // Game over - no valid moves for either player
            gameActive = false;
            const winner = scores.black > scores.white ? 'Black' : scores.white > scores.black ? 'White' : 'Tie';
            gameStatusElement.textContent = `Game Over! ${winner === 'Tie' ? 'Tie Game!' : winner + ' wins!'}`;
            return;
        } else {
            // Current player has no moves, so they pass
            gameStatusElement.textContent = `${currentPlayer === 'black' ? 'Black' : 'White'} has no valid moves. ${currentPlayer === 'black' ? 'White' : 'Black'}'s turn.`;
        }
    }
    
    updateUI();
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

// Update UI elements
function updateUI() {
    // Update scores
    blackScoreElement.textContent = scores.black;
    whiteScoreElement.textContent = scores.white;
    
    // Update current player
    currentPlayerElement.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
    
    // Update game status
    if (gameActive) {
        gameStatusElement.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
    }
    
    // Update board display
    updateBoardDisplay();
    
    // Update move history
    updateMoveHistory();
}

// Update board display
function updateBoardDisplay() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        // Clear cell
        cell.innerHTML = '';
        
        // Add disc if exists
        if (board[row][col]) {
            const disc = document.createElement('div');
            disc.className = `disc ${board[row][col]}`;
            cell.appendChild(disc);
        }
        
        // Show valid moves for current player
        if (gameActive && board[row][col] === null && isValidMove(row, col, currentPlayer)) {
            cell.classList.add('valid-move');
        } else {
            cell.classList.remove('valid-move');
        }
    });
}

// Update move history display
function updateMoveHistory() {
    moveHistoryList.innerHTML = '';
    
    moveHistory.forEach((move, index) => {
        const listItem = document.createElement('li');
        const player = move.player.charAt(0).toUpperCase() + move.player.slice(1);
        const row = move.row + 1;
        const col = String.fromCharCode(65 + move.col); // A-H
        listItem.textContent = `Move ${index + 1}: ${player} at ${col}${row}`;
        moveHistoryList.appendChild(listItem);
    });
    
    // Scroll to bottom
    moveHistoryList.scrollTop = moveHistoryList.scrollHeight;
}

// AI move function
function makeAIMove() {
    if (!gameActive || !aiEnabled || currentPlayer !== 'white') return;
    
    // Get all valid moves
    const validMoves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === null && isValidMove(row, col, currentPlayer)) {
                validMoves.push({ row, col });
            }
        }
    }
    
    if (validMoves.length === 0) {
        // No valid moves, pass turn
        currentPlayer = 'black';
        checkGameEnd();
        return;
    }
    
    // Simple AI: choose a random valid move or implement difficulty-based logic
    let chosenMove;
    
    if (aiDifficulty === 'easy') {
        // Random move
        chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    } else if (aiDifficulty === 'medium') {
        // Greedy approach: choose move that flips the most discs
        let maxFlips = -1;
        for (const move of validMoves) {
            const flips = countFlips(move.row, move.col, currentPlayer);
            if (flips > maxFlips) {
                maxFlips = flips;
                chosenMove = move;
            }
        }
    } else {
        // Hard: more advanced strategy (same as medium for now)
        let maxFlips = -1;
        for (const move of validMoves) {
            const flips = countFlips(move.row, move.col, currentPlayer);
            if (flips > maxFlips) {
                maxFlips = flips;
                chosenMove = move;
            }
        }
    }
    
    // Make the move
    makeMove(chosenMove.row, chosenMove.col);
}

// Count how many discs would be flipped by a move
function countFlips(row, col, player) {
    let totalFlips = 0;
    
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dx, dy] of directions) {
        if (checkDirection(row, col, dx, dy, player)) {
            let x = row + dx;
            let y = col + dy;
            let flipsInDirection = 0;
            
            while (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] !== player && board[x][y] !== null) {
                flipsInDirection++;
                x += dx;
                y += dy;
            }
            
            totalFlips += flipsInDirection;
        }
    }
    
    return totalFlips;
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initGame);