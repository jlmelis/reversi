// AI settings
let aiEnabled = false;
let aiDifficulty = 'medium';

// Check if AI is enabled
function isAIEnabled() {
    return aiEnabled;
}

// Get AI difficulty
function getAIDifficulty() {
    return aiDifficulty;
}

// Set AI enabled
function setAIEnabled(enabled) {
    aiEnabled = enabled;
}

// Set AI difficulty
function setAIDifficulty(difficulty) {
    aiDifficulty = difficulty;
}

// Make AI move
function makeAIMove(board, currentPlayer, isValidMove, makeMove, checkGameEnd, switchPlayer) {
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
        return { passed: true };
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
            const flips = countFlips(move.row, move.col, currentPlayer, board, isValidMove, checkDirection);
            if (flips > maxFlips) {
                maxFlips = flips;
                chosenMove = move;
            }
        }
    } else {
        // Hard: more advanced strategy (same as medium for now)
        let maxFlips = -1;
        for (const move of validMoves) {
            const flips = countFlips(move.row, move.col, currentPlayer, board, isValidMove, checkDirection);
            if (flips > maxFlips) {
                maxFlips = flips;
                chosenMove = move;
            }
        }
    }
    
    // Make the move
    return { move: chosenMove };
}

// Count how many discs would be flipped by a move
function countFlips(row, col, player, board, isValidMove, checkDirection) {
    let totalFlips = 0;
    
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dx, dy] of directions) {
        if (checkDirection(row, col, dx, dy, player, board)) {
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

// Check a specific direction for valid move (needed for countFlips)
function checkDirection(row, col, dx, dy, player, board) {
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

// Export functions
export {
    isAIEnabled,
    getAIDifficulty,
    setAIEnabled,
    setAIDifficulty,
    makeAIMove
};