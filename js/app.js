import * as game from './game.js';
import * as ui from './ui.js';
import * as ai from './ai.js';

// Initialize the game
function initGame() {
    ui.initUI();
    game.initBoard();
    ui.createBoardDisplay(game.getBoard());
    setupEventListeners();
    ui.updateUI(game.getScores(), game.getCurrentPlayer(), game.getGameActive(), game.getMoveHistory());
    ui.updateBoardDisplay(game.getBoard(), game.getCurrentPlayer(), game.getGameActive(), game.isValidMove);
}

// Set up event listeners
function setupEventListeners() {
    const { boardElement, restartButton, aiToggle, difficultySelect } = ui.getDOMElements();
    
    // Cell click event
    boardElement.addEventListener('click', handleCellClick);
    
    // Restart button
    restartButton.addEventListener('click', initGame);
    
    // AI toggle
    aiToggle.addEventListener('change', function() {
        ai.setAIEnabled(this.checked);
        difficultySelect.disabled = !ai.isAIEnabled();
        if (ai.isAIEnabled() && game.getCurrentPlayer() === 'white') {
            setTimeout(handleAIMove, 500); // Small delay for better UX
        }
    });
    
    // Difficulty change
    difficultySelect.addEventListener('change', function() {
        ai.setAIDifficulty(this.value);
    });
}

// Handle cell click
function handleCellClick(event) {
    if (!game.getGameActive()) return;
    
    const cell = event.target.closest('.cell');
    if (!cell) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    // Check if it's a valid move
    if (game.isValidMove(row, col, game.getCurrentPlayer())) {
        makePlayerMove(row, col);
    }
}

// Make a player move
function makePlayerMove(row, col) {
    game.makeMove(row, col, game.getCurrentPlayer());
    
    // Update UI
    ui.updateBoardDisplay(
        game.getBoard(), 
        game.getCurrentPlayer(), 
        game.getGameActive(), 
        game.isValidMove
    );
    
    // Check if game should continue
    if (game.getGameActive()) {
        // Switch to next player
        game.switchPlayer();
        
        // Update UI
        ui.updateUI(
            game.getScores(), 
            game.getCurrentPlayer(), 
            game.getGameActive(), 
            game.getMoveHistory()
        );
        
        // Update board display for next player
        ui.updateBoardDisplay(
            game.getBoard(), 
            game.getCurrentPlayer(), 
            game.getGameActive(), 
            game.isValidMove
        );
        
        // Check if game is over
        const gameStatus = game.checkGameEnd();
        
        if (gameStatus.gameOver) {
            ui.setGameOverMessage(gameStatus.winner);
            return;
        } else if (gameStatus.passed) {
            ui.setPassMessage(game.getCurrentPlayer());
        }
        
        // If playing against AI and it's AI's turn
        if (ai.isAIEnabled() && game.getCurrentPlayer() === 'white') {
            setTimeout(handleAIMove, 500); // Small delay for better UX
        }
    }
}

// Handle AI move
function handleAIMove() {
    if (!game.getGameActive() || !ai.isAIEnabled() || game.getCurrentPlayer() !== 'white') return;
    
    const aiMove = ai.makeAIMove(
        game.getBoard(),
        game.getCurrentPlayer(),
        game.isValidMove,
        game.makeMove,
        game.checkGameEnd,
        game.switchPlayer
    );
    
    if (aiMove.passed) {
        // AI has no valid moves, pass turn
        game.switchPlayer();
        const gameStatus = game.checkGameEnd();
        
        if (gameStatus.gameOver) {
            ui.setGameOverMessage(gameStatus.winner);
            return;
        } else if (gameStatus.passed) {
            ui.setPassMessage(game.getCurrentPlayer());
        }
        
        // Update UI
        ui.updateUI(
            game.getScores(), 
            game.getCurrentPlayer(), 
            game.getGameActive(), 
            game.getMoveHistory()
        );
        
        // Update board display
        ui.updateBoardDisplay(
            game.getBoard(), 
            game.getCurrentPlayer(), 
            game.getGameActive(), 
            game.isValidMove
        );
    } else if (aiMove.move) {
        // Make the AI move
        game.makeMove(aiMove.move.row, aiMove.move.col, game.getCurrentPlayer());
        
        // Update UI
        ui.updateBoardDisplay(
            game.getBoard(), 
            game.getCurrentPlayer(), 
            game.getGameActive(), 
            game.isValidMove
        );
        
        // Switch to next player
        game.switchPlayer();
        
        // Check if game is over
        const gameStatus = game.checkGameEnd();
        
        if (gameStatus.gameOver) {
            ui.setGameOverMessage(gameStatus.winner);
            return;
        } else if (gameStatus.passed) {
            ui.setPassMessage(game.getCurrentPlayer());
        }
        
        // Update UI
        ui.updateUI(
            game.getScores(), 
            game.getCurrentPlayer(), 
            game.getGameActive(), 
            game.getMoveHistory()
        );
        
        // Update board display
        ui.updateBoardDisplay(
            game.getBoard(), 
            game.getCurrentPlayer(), 
            game.getGameActive(), 
            game.isValidMove
        );
    }
}

// Initialize UI and game when page loads
document.addEventListener('DOMContentLoaded', initGame);