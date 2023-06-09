// GameController
// only need one.. create using module pattern

const game = (() => {
  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2", "O");
  let ai = false;
  let aiDifficulty = "easy";
  let activePlayer = player1;
  let gameState = "active";

  const modal = document.querySelector(".modal");
  const options = document.querySelector("#frm-options");
  const player1Info = document.querySelector(".playerX");
  const player2Info = document.querySelector(".playerY");
  const playAI = document.querySelector("#playAI");
  const btnPlayAgain = document.querySelector(".btn-playagain");
  const btnReset = document.querySelector(".btn-reset");

  options.addEventListener("submit", setOptions);
  playAI.addEventListener("click", setAIOptions);
  btnPlayAgain.addEventListener("click", playAgain);
  btnReset.addEventListener("click", reset);

  function setOptions(e) {
    e.preventDefault();
    console.log(e);
    const p1Name = document.querySelector("#player1Name");
    const p2Name = document.querySelector("#player2Name");
    player1.name = p1Name.value;
    player2.name = p2Name.value;
    modal.classList.add("hidden");
    playAgain();
  }

  function setAIOptions() {
    const p2Name = document.querySelector("#player2Name");
    const difficulty = document.querySelectorAll(".ai-difficulty");
    if (playAI.checked) {
      p2Name.value = "Computer";
      ai = true;
      difficulty.forEach((item) => {
        item.disabled = false;
        item.addEventListener("change", handleDifficultyChange);
      });
    } else {
      p2Name.value = "";
      ai = false;
      difficulty.forEach((item) => {
        item.disabled = true;
        item.removeEventListener("change", handleDifficultyChange);
      });
    }
  }

  function handleDifficultyChange() {
    if (this.checked) {
      aiDifficulty = this.dataset.difficutly;
    }
  }

  function playAgain() {
    setActivePlayer();
    game.gameState = "active";
    gameBoard.resetBoard();
    btnPlayAgain.disabled;
  }

  function reset() {
    modal.classList.remove("hidden");
  }

  function setActivePlayer() {
    if (activePlayer === player1) {
      activePlayer = player2;
      if (ai === true) {
        gameBoard.aiMove();
      }
    } else {
      activePlayer = player1;
    }
    player1Info.classList.toggle("active-player");
    player2Info.classList.toggle("active-player");
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function checkForWin(board) {
    const winPositions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    winPositions.forEach((winArray) => {
      if (winArray.every((cell) => board[cell] === activePlayer.token)) {
        console.log(winArray);
        gameBoard.highlightWin(winArray);
        game.gameState = "won";
        btnPlayAgain.disabled = false;
      }
    });

    if (gameState === "active" && board.every((cell) => cell != "")) {
      game.gameState = "tie";
    }
    if (gameState === "active") {
      game.setActivePlayer();
    }
    console.log(gameState);
  }

  return {
    getActivePlayer,
    setActivePlayer,
    checkForWin,
    gameState,
    aiDifficulty,
  };
})();

// Players
// need multiples.. create using a factory pattern

function createPlayer(name, token) {
  return {
    name,
    token,
  };
}

// GameBoard
// only need one.. create using module pattern
const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  console.log(board);

  // get reference to the DOM elements
  const gameBoard = document.querySelector(".gameboard");

  // attach event handlers
  board.forEach((item, index) => {
    gameBoard
      .querySelector(`.cell[data-id="${index}"]`)
      .addEventListener("click", () => markCell(index));
  });

  function markCell(cell) {
    console.log(game.gameState);
    if (game.gameState !== "active") return;
    if (board[cell] !== "") return;
    const activePlayer = game.getActivePlayer();
    board[cell] = activePlayer.token;
    renderBoard();
    game.checkForWin(board);
  }

  function aiMove() {
    if (game.aiDifficulty === "easy") {
      //randomise positon
      const availablePositions = getAvailablePositions(board);
      position =
        availablePositions[
          Math.floor(Math.random() * availablePositions.length)
        ];

      console.log("Position: ", position, "value: ", board[position]);
      markCell(position);
    } else if (game.aiDifficulty === "impossible") {
      //get available spaces
      console.log(getAvailablePositions(board));
    }
  }

  function getAvailablePositions(board) {
    const availablePositions = [];
    board.forEach((position, index) => {
      if (position === "") {
        availablePositions.push(index);
      }
    });
    return availablePositions;
  }

  const renderBoard = () => {
    board.forEach((cell, index) => {
      const btn = gameBoard.querySelector(`[data-id="${index}"]`);
      btn.textContent = cell;
      btn.classList.remove("win");
    });
  };

  function highlightWin(winPositions) {
    winPositions.forEach((cell) => {
      gameBoard.querySelector(`.cell[data-id="${cell}"]`).classList.add("win");
    });
  }

  function resetBoard() {
    board.forEach((item, index) => {
      board[index] = "";
      console.log(board);
    });
    renderBoard();
  }

  return { resetBoard, highlightWin, aiMove };
})();
