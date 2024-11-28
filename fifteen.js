const tiles = document.querySelectorAll(".tile")
const tileSize = 100
const gridSize = 4
let emptyRow = 3
let emptyCol = 3

document.getElementById("startB").onclick = function () {
  document.getElementById("startB").style.display = "none"
  document.getElementById("shuffleB").style.display = "inline-block"
  document.getElementById("solveB").style.display = "inline-block"

  board()
  tiles.forEach((tile) => {
    tile.style.display = "block"
  })
  const messageArea = document.getElementById("message")
  messageArea.textContent = "click shuffle to start"
  messageArea.style.color = "black"
}

function board() {
  tiles.forEach((tile) => {
    //gets row and column from grid in html
    const row = parseInt(tile.dataset.row, 10)
    const col = parseInt(tile.dataset.col, 10)
    /*uses parsed data to apply positions of each tile
    top left is 0px 0px,
    bottom left is col 0px row 300x*/
    tile.style.left = `${col * tileSize}px`
    tile.style.top = `${row * tileSize}px`
    /*applies negation to tile background to account offsetting of image
    bottom left would be col 0px, row -300px*/
    const bgX = -col * tileSize
    const bgY = -row * tileSize
    tile.style.backgroundPosition = `${bgX}px ${bgY}px`

    tile.onclick = moveTile
    tile.onmouseover = isMovable
  })
}

function updateMessage(text, color) {
  const messageArea = document.getElementById("message")
  messageArea.textContent = text
  messageArea.style.color = color
}

function checkSolved() {
  let solved = true
  //hardcoded correct grid position of tiles
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
    //3,3 is empty space
  }

  tiles.forEach((tile) => {
    const tileNumber = parseInt(tile.textContent, 10)
    const currentRow = parseInt(tile.dataset.row, 10)
    const currentCol = parseInt(tile.dataset.col, 10)
    const { row: solvedRow, col: solvedCol } = correctPositions[tileNumber]

    if (currentRow !== solvedRow || currentCol !== solvedCol) {
      solved = false
    }
  })

  const messageArea = document.getElementById("message")
  if (solved) {
    updateMessage("puzzle solved!", "green")
  } else {
    updateMessage("puzzle is not solved yet", "black")
  }
}

function moveTile() {
  const row = parseInt(this.dataset.row, 10)
  const col = parseInt(this.dataset.col, 10)

  if (adjacent(row, col)) {
    //gets pixel location of empty space
    this.style.top = `${emptyRow * tileSize}px`
    this.style.left = `${emptyCol * tileSize}px`
    /*updates row and col grid locations of
    clicked tile as well as empty space to swap locations*/
    this.dataset.row = emptyRow
    this.dataset.col = emptyCol
    emptyRow = row
    emptyCol = col

    checkSolved()
    isMovable()
  }
}

//checks for adjacent tiles by finding difference of grid positions
//difference of 1 on either x or y position indicates adjacent tile, while both means diagonal
function adjacent(row, col) {
  const rowDiff = Math.abs(row - emptyRow)
  const colDiff = Math.abs(col - emptyCol)
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
}

function isMovable() {
  //without removing movable class, all previously applied would stay
  tiles.forEach((tile) => {
    tile.classList.remove("movable")
  })
  //movable css class to tiles adjacent to indicate can be moved
  tiles.forEach((tile) => {
    const row = parseInt(tile.dataset.row, 10)
    const col = parseInt(tile.dataset.col, 10)

    if (adjacent(row, col)) {
      tile.classList.add("movable")
    }
  })
}

document.getElementById("shuffleB").onclick = function () {
  const moves = 1000
  /*creates an array of all adjacent tiles and then 
  randomly selects which one to move
  */
  for (let i = 0; i < moves; i++) {
    const neighbors = []
    tiles.forEach((tile) => {
      const row = parseInt(tile.dataset.row, 10)
      const col = parseInt(tile.dataset.col, 10)

      if (adjacent(row, col)) {
        neighbors.push(tile)
      }
    })

    const randIndex = Math.floor(Math.random() * neighbors.length)
    const randNeighbor = neighbors[randIndex]
    moveTile.call(randNeighbor)
  }

  updateMessage("puzzle is not solved yet", "black")
  isMovable()
}

document.getElementById("solveB").onclick = function () {
  tiles.forEach((tile) => {
    const originalRow = (parseInt(tile.textContent - 1) / gridSize) | 0
    const originalCol = (tile.textContent - 1) % gridSize

    tile.style.top = `${originalRow * tileSize}px`
    tile.style.left = `${originalCol * tileSize}px`

    tile.dataset.row = originalRow
    tile.dataset.col = originalCol
  })
  updateMessage("puzzle solved!", "green")

  //reset location of empty space
  emptyRow = 3
  emptyCol = 3
}