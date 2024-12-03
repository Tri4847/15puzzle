const tiles = document.querySelectorAll(".tile");
const tileSize = 100;
const gridSize = 4;
let emptyRow = 3;
let emptyCol = 3;

document.getElementById("startB").onclick = function () {
  document.getElementById("startB").style.display = "none";
  document.getElementById("shuffleB").style.display = "inline-block";
  document.getElementById("solveB").style.display = "inline-block";

  board();
  tiles.forEach((tile) => {
    tile.style.display = "block";
  });
  const messageArea = document.getElementById("message");
  messageArea.textContent = "Click shuffle to start";
  messageArea.style.color = "black";
};

function board() {
  const selectedPuzzle = localStorage.getItem("selectedPuzzle") || "sonic";

  tiles.forEach((tile) => {
    tile.style.backgroundImage = `url('${selectedPuzzle}.png')`;

    const row = parseInt(tile.dataset.row, 10);
    const col = parseInt(tile.dataset.col, 10);

    tile.style.left = `${col * tileSize}px`;
    tile.style.top = `${row * tileSize}px`;

    const bgX = -col * tileSize;
    const bgY = -row * tileSize;
    tile.style.backgroundPosition = `${bgX}px ${bgY}px`;

    tile.onclick = moveTile;
    tile.onmouseover = isMovable;
  });
}

function updateMessage(text, color) {
  const messageArea = document.getElementById("message");
  messageArea.textContent = text;
  messageArea.style.color = color;
}

function checkSolved() {
  let solved = true;
  const correctPositions = {
    1: { row: 0, col: 0 },
    2: { row: 0, col: 1 },
    3: { row: 0, col: 2 },
    4: { row: 0, col: 3 },
    5: { row: 1, col: 0 },
    6: { row: 1, col: 1 },
    7: { row: 1, col: 2 },
    8: { row: 1, col: 3 },
    9: { row: 2, col: 0 },
    10: { row: 2, col: 1 },
    11: { row: 2, col: 2 },
    12: { row: 2, col: 3 },
    13: { row: 3, col: 0 },
    14: { row: 3, col: 1 },
    15: { row: 3, col: 2 },
  };

  tiles.forEach((tile) => {
    const tileNumber = parseInt(tile.textContent, 10);
    const currentRow = parseInt(tile.dataset.row, 10);
    const currentCol = parseInt(tile.dataset.col, 10);
    const { row: solvedRow, col: solvedCol } = correctPositions[tileNumber];

    if (currentRow !== solvedRow || currentCol !== solvedCol) {
      solved = false;
    }
  });

  if (solved) {
    updateMessage("Puzzle solved!", "green");
    showCelebration(); 
  } else {
    updateMessage("Puzzle is not solved yet", "black");
  }
}

function showCelebration() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; 
  overlay.style.backgroundImage = "url('confetti.gif')"; 
  overlay.style.backgroundSize = "cover";
  overlay.style.backgroundRepeat = "no-repeat";
  overlay.style.backgroundPosition = "center";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";


  const message = document.createElement("h1");
  message.textContent = "Congratulations! You solved the puzzle!";
  message.style.fontSize = "3rem";
  message.style.color = "white";
  message.style.textAlign = "center";
  message.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.7)";
  message.style.marginBottom = "20px";


  overlay.appendChild(message);
  document.body.appendChild(overlay);


  setTimeout(() => {
    document.body.removeChild(overlay);
  }, 3000);
}


function moveTile() {
  const row = parseInt(this.dataset.row, 10);
  const col = parseInt(this.dataset.col, 10);

  if (adjacent(row, col)) {
    this.style.top = `${emptyRow * tileSize}px`;
    this.style.left = `${emptyCol * tileSize}px`;

    this.dataset.row = emptyRow;
    this.dataset.col = emptyCol;
    emptyRow = row;
    emptyCol = col;

    checkSolved();
    isMovable();
  }
}

function adjacent(row, col) {
  const rowDiff = Math.abs(row - emptyRow);
  const colDiff = Math.abs(col - emptyCol);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function isMovable() {
  tiles.forEach((tile) => {
    tile.classList.remove("movable");
  });

  tiles.forEach((tile) => {
    const row = parseInt(tile.dataset.row, 10);
    const col = parseInt(tile.dataset.col, 10);

    if (adjacent(row, col)) {
      tile.classList.add("movable");
    }
  });
}

document.getElementById("shuffleB").onclick = function () {
  const moves = 1000;
  for (let i = 0; i < moves; i++) {
    const neighbors = [];
    tiles.forEach((tile) => {
      const row = parseInt(tile.dataset.row, 10);
      const col = parseInt(tile.dataset.col, 10);

      if (adjacent(row, col)) {
        neighbors.push(tile);
      }
    });

    const randIndex = Math.floor(Math.random() * neighbors.length);
    const randNeighbor = neighbors[randIndex];
    moveTile.call(randNeighbor);
  }

  updateMessage("Puzzle is not solved yet", "black");
  isMovable();
};

document.getElementById("solveB").onclick = function () {
  tiles.forEach((tile) => {
    const originalRow = (parseInt(tile.textContent - 1) / gridSize) | 0;
    const originalCol = (tile.textContent - 1) % gridSize;

    tile.style.top = `${originalRow * tileSize}px`;
    tile.style.left = `${originalCol * tileSize}px`;

    tile.dataset.row = originalRow;
    tile.dataset.col = originalCol;
  });


  emptyRow = 3;
  emptyCol = 3;


  updateMessage("Puzzle solved!", "green");
  showCelebration();
};