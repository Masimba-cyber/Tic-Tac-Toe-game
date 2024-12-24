let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let scoreX = 0;
let scoreO = 0;
let gameMode = "player"; // Default to two-player mode
let aiActive = false;

const squares = document.querySelectorAll(".square");
const resetButton = document.getElementById("resetButton");
const scoreXDisplay = document.getElementById("scoreX");
const scoreODisplay = document.getElementById("scoreO");
const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");
const modeSelect = document.getElementById("gameMode");

modeSelect.addEventListener("change", function () {
  gameMode = modeSelect.value;
  aiActive = (gameMode === "computer");
  resetGame();
});

// Winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Function to handle square clicks
function handleClick(event) {
  const squareIndex = event.target.id;

  if (board[squareIndex] !== "" || !gameActive || (aiActive && currentPlayer === "O")) return;

  // Mark the square with the current player's symbol (X or O)
  board[squareIndex] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add(currentPlayer.toLowerCase()); // Add class to color X and O
  moveSound.play(); // Play sound on move

  // Check if the current player wins
  if (checkWinner()) {
    highlightWinningLine();
    winSound.play(); // Play win sound
    setTimeout(() => alert(`${currentPlayer} wins!`), 100);
    updateScore(currentPlayer);
    gameActive = false;
    return;
  }

  // Check if it's a draw
  if (board.every(square => square !== "")) {
    drawSound.play(); // Play draw sound
    setTimeout(() => alert("It's a draw!"), 100);
    gameActive = false;
    return;
  }

  // Switch to the next player
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // If it's AI's turn, make the move
  if (aiActive && currentPlayer === "O" && gameActive) {
    aiMove();
  }
}

// Function to check for winner
function checkWinner() {
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return board[a] !== "" && board[a] === board[b] && board[a] === board[c];
  });
}

// Function to highlight the winning line
function highlightWinningLine() {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] === board[b] && board[a] === board[c]) {
      document.getElementById(a).classList.add("win");
      document.getElementById(b).classList.add("win");
      document.getElementById(c).classList.add("win");
    }
  }
}

// Function to update the score
function updateScore(winner) {
  if (winner === "X") {
    scoreX++;
    scoreXDisplay.textContent = `Player X: ${scoreX}`;
  } else {
    scoreO++;
    scoreODisplay.textContent = `Player O: ${scoreO}`;
  }
}

// Function to make the AI move (basic random AI)
function aiMove() {
  const availableSpots = board
    .map((value, index) => value === "" ? index : null)
    .filter(value => value !== null);

  const randomMove = availableSpots[Math.floor(Math.random() * availableSpots.length)];
  board[randomMove] = "O";
  document.getElementById(randomMove).textContent = "O";
  document.getElementById(randomMove).classList.add("o");
  moveSound.play(); // Play sound for AI move

  // Check for winner after AI move
  if (checkWinner()) {
    highlightWinningLine();
    winSound.play(); // Play win sound
    setTimeout(() => alert("Computer wins!"), 100);
    updateScore("O");
    gameActive = false;
    return;
  }

  // Check for draw
  if (board.every(square => square !== "")) {
    drawSound.play(); // Play draw sound
    setTimeout(() => alert("It's a draw!"), 100);
    gameActive = false;
  }

  // Switch to Player X
  currentPlayer = "X";
}

// Function to reset the game
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  squares.forEach(square => {
    square.textContent = "";
    square.classList.remove("x", "o", "win");
  });
}
  
// Add event listeners to each square
squares.forEach(square => {
  square.addEventListener("click", handleClick);
});

// Reset button functionality
resetButton.addEventListener("click", resetGame);
