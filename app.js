// GameController
// only need one.. create using module pattern

const game = (() => {
  const player1 = createPlayer("Ian", "X");
  const player2 = createPlayer("Bob", "O");

  let activePlayer = player2;

  function setActivePlayer() {
    if (activePlayer === player1) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }
  }

  function getActivePlayer() {
    return activePlayer;
  }

  return { getActivePlayer, setActivePlayer };
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
    if (board[cell] !== "") return;
    const activePlayer = game.getActivePlayer();
    board[cell] = activePlayer.token;
    game.setActivePlayer();
    console.log(board);
    renderBoard();
  }

  const renderBoard = () => {
    board.forEach((cell, index) => {
      const btn = gameBoard.querySelector(`[data-id="${index}"]`);
      btn.textContent = cell;
    });
  };

  function resetBoard() {
    board.forEach((item, index) => {
      board[index] = "";
      console.log(board);
    });
    renderBoard();
  }

  return { resetBoard };
})();
