// DOM elements
let boardElement;
let blackScoreElement;
let whiteScoreElement;
let currentPlayerElement;
let gameStatusElement;
let moveHistoryList;
let restartButton;
let aiToggle;
let difficultySelect;

// Initialize UI elements
function initUI() {
    boardElement = document.getElementById('board');
    blackScoreElement = document.getElementById('black-score');
    whiteScoreElement = document.getElementById('white-score');
    currentPlayerElement = document.getElementById('current-player');
    gameStatusElement = document.getElementById('game-status');
    moveHistoryList = document.getElementById('move-history-list');
    restartButton = document.getElementById('restart-btn');
    aiToggle = document.getElementById('ai-toggle');
    difficultySelect = document.getElementById('difficulty');
}

// Create the game board display
function createBoardDisplay(board) {
    boardElement.innerHTML = '';
    
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

// Update board display
function updateBoardDisplay(board, currentPlayer, gameActive, isValidMove) {
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

// Update UI elements
function updateUI(scores, currentPlayer, gameActive, moveHistory) {
    // Update scores
    blackScoreElement.textContent = scores.black;
    whiteScoreElement.textContent = scores.white;
    
    // Update current player
    currentPlayerElement.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
    
    // Update game status
    if (gameActive) {
        gameStatusElement.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
    }
    
    // Update move history
    updateMoveHistory(moveHistory);
}

// Update move history display
function updateMoveHistory(moveHistory) {
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

// Set game over message
function setGameOverMessage(winner) {
    if (winner === 'tie') {
        gameStatusElement.textContent = 'Game Over! Tie Game!';
    } else {
        const winnerName = winner.charAt(0).toUpperCase() + winner.slice(1);
        gameStatusElement.textContent = `Game Over! ${winnerName} wins!`;
    }
}

// Set pass message
function setPassMessage(currentPlayer) {
    const playerName = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
    const otherPlayer = currentPlayer === 'black' ? 'White' : 'Black';
    gameStatusElement.textContent = `${playerName} has no valid moves. ${otherPlayer}'s turn.`;
}

// Get DOM elements (for event listeners in main app)
function getDOMElements() {
    return {
        boardElement,
        restartButton,
        aiToggle,
        difficultySelect
    };
}

// Export functions
export {
    initUI,
    createBoardDisplay,
    updateBoardDisplay,
    updateUI,
    setGameOverMessage,
    setPassMessage,
    getDOMElements
};