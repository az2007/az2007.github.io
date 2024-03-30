const cursor = document.querySelector(".cursor");
var timeout;
var startTime;
var selectedSudokus = [];

document.addEventListener("mousemove", (e) => {
  let x = e.pageX;
  let y = e.pageY;

  cursor.style.top = y + "px";
  cursor.style.left = x + "px";
  cursor.style.display = "block";

  function stoppedMouse() {
    cursor.style.display = "none";
  }
  clearTimeout(timeout);
  timeout = setTimeout(stoppedMouse, 1000);
});

document.addEventListener("mouseout", () => {
  cursor.style.display = "none";
});

var numSelected = null;
var tileSelected = null;
let errors = 0;
var board = [
  "--74916-5",
  "2---6-3-9",
  "-----7-1-",
  "-586----4",
  "--3----9-",
  "--62--187",
  "9-4-7---2",
  "67-83----",
  "81--45---",
];

var solution = [
  "387491625",
  "241568379",
  "569327418",
  "758619234",
  "123784596",
  "496253187",
  "934176852",
  "675832941",
  "812945763",
];

window.onload = function () {
  setGame();
  startTimer();
  generateNumberBlocks();
};

document.addEventListener("DOMContentLoaded", function () {
  const newGameBtn = document.querySelector(".new-game-btn");

  newGameBtn.addEventListener("click", function () {
    resetGame();
    generateRandomBoard();
  });
  generateNumberBlocks();
});

function resetGame() {
  errors = 0;
  document.getElementById("errors").innerText = "Mistakes : 0";

  clearInterval(timerInterval);
  startTime = new Date().getTime();
  startTimer();

  document.getElementById("board").innerHTML = "";
}

var correctAnswers = [];

function generateRandomBoard() {
  document.getElementById("board").innerHTML = "";

  let randomSudoku = generateRandomSudoku();
  board = randomSudoku.board;
  solution = randomSudoku.solution;
  correctAnswers = randomSudoku.correctAnswers;

  setGame();
}

function generateRandomSudoku() {
  const randomSudoku = {
    board: [],
    solution: [],
    correctAnswers: [],
  };

  randomSudoku.board = generateRandomArray();
  fillSudoku(randomSudoku.board, 0, 0);
  randomSudoku.solution = JSON.parse(JSON.stringify(randomSudoku.board));
  randomSudoku.correctAnswers = JSON.parse(JSON.stringify(randomSudoku.board));

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (Math.random() < 0.5) {
        randomSudoku.board[i][j] = "-";
      }
    }
  }

  return randomSudoku;
}

function selectTile() {
  if (numSelected) {
    if (this.dataset.filled === "true") {
      return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (board[r][c] == "-") {
      if (solution[r][c] == numSelected.id) {
        this.innerText = numSelected.id;
        this.dataset.filled = "true";
      } else {
        errors += 1;
        document.getElementById("errors").innerText = "Mistakes : " + errors;
        if (errors === 3) {
          gameOver();
        }
      }
    } else {
      if (solution[r][c] == numSelected.id) {
        this.innerText = numSelected.id;
        this.dataset.filled = "true";
      } else {
        errors += 1;
        document.getElementById("errors").innerText = "Mistakes : " + errors;
        if (errors === 3) {
          gameOver();
        }
      }
    }
  }
}

function generateNumberBlocks() {
  const digitsContainer = document.getElementById("digits1");

  digitsContainer.innerHTML = "";

  for (let i = 1; i <= 9; i++) {
    let number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", selectNumber);
    number.classList.add("number");
    digitsContainer.appendChild(number);
  }
}

function generateRandomArray() {
  const randomArray = [];
  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
      row.push(null);
    }
    randomArray.push(row);
  }

  fillSudoku(randomArray, 0, 0);

  return randomArray;
}

function fillSudoku(board, row, col) {
  if (row === 9) {
    return true;
  }

  let nextRow = row;
  let nextCol = col + 1;
  if (nextCol === 9) {
    nextRow++;
    nextCol = 0;
  }

  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(nums);

  for (const num of nums) {
    if (isValidMove(board, row, col, num)) {
      board[row][col] = num;
      if (fillSudoku(board, nextRow, nextCol)) {
        return true;
      }
      board[row][col] = null;
    }
  }

  return false;
}

function isValidMove(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) {
      return false;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function setGame() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      if (board[r][c] != "-") {
        tile.innerText = board[r][c];
        tile.classList.add("tile-start");
      } else {
        tile.dataset.filled = "false";
      }
      if (r == 2 || r == 5) {
        tile.classList.add("horizontal-line");
      }
      if (c == 2 || c == 5) {
        tile.classList.add("vertical-line");
      }
      tile.addEventListener("click", selectTile);
      tile.classList.add("tile");
      document.getElementById("board").append(tile);
    }
  }
  generateNumberBlocks();
}

function selectNumber() {
  if (numSelected != null) {
    numSelected.classList.remove("number-selected");
  }
  numSelected = this;
  numSelected.classList.add("number-selected");
}

function gameOver() {
  alert("Game Over! You have made 3 mistakes.");
  location.reload();
}

function startTimer() {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  var currentTime = new Date().getTime();
  var elapsedTime = currentTime - startTime;
  var minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  document.getElementById("timer").innerText =
    "Time: " + minutes + "m " + seconds + "s";
}

function checkGameCompletion() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      if (
        tile.dataset.filled === "false" ||
        tile.innerText !== solution[r][c]
      ) {
        return false;
      }
    }
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const newGameBtn = document.querySelector(".new-game-btn");
  const checkGameBtn = document.querySelector(".check-game-btn");

  newGameBtn.addEventListener("click", function () {
    resetGame();
    generateRandomBoard();
  });

  checkGameBtn.addEventListener("click", function () {
    checkGame();
  });

  generateNumberBlocks();
});

function checkGame() {
  if (checkGameCompletion()) {
    alert("Congratulations! You won!");
    location.reload();
  } else {
    alert("Not all cells are filled correctly!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const checkGameBtn = document.querySelector(".new-game-btn");

  checkGameBtn.addEventListener("click", function () {
    this.classList.add("active");
    setTimeout(() => {
      this.classList.remove("active");
    }, 200);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const checkGameBtn = document.querySelector(".check-game-btn");

  checkGameBtn.addEventListener("click", function () {
    this.classList.add("active");
    setTimeout(() => {
      this.classList.remove("active");
    }, 200);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  gsap.from("#errors", { opacity: 0, y: -50, duration: 1, delay: 0.5 });

  gsap.from("#timer", { opacity: 0, y: -50, duration: 1, delay: 0.5 });

  setTimeout(function () {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(function (tile) {
      tile.classList.add("tile-appear");
    });

    gsap.from(".tile-appear", {
      opacity: 0,
      y: -50,
      stagger: 0.1,
      duration: 0.2,
    });
  }, 1000);
});
