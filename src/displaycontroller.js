import Game from "./game";

class DisplayController {
  constructor() {
    this.game = new Game();
    this.init();
  }

  init = () => {
    this.content = document.getElementById("content");
    this.modalOverlay = document.querySelector(".modalOverlay");
    this.createBoards();
    this.enemyBoard.addEventListener("click", this.makeTurn);
  };

  createBoards = () => {
    const playerBoard = document.createElement("div");
    playerBoard.className = "playerBoard";

    for (let i = 0; i < 10; i++) {
      const row = document.createElement("div");
      row.className = "row";
      for (let j = 0; j < 10; j++) {
        const cell = document.createElement("cell");
        cell.className = "cell";
        row.appendChild(cell);
      }
      playerBoard.appendChild(row);
    }

    const enemyBoard = playerBoard.cloneNode(true);
    enemyBoard.className = "enemyBoard";

    this.playerBoard = playerBoard;
    this.enemyBoard = enemyBoard;

    this.content.appendChild(playerBoard);
    this.content.appendChild(enemyBoard);

    this.updateBoards();
  };

  updateBoards = () => {
    const playerBoard = this.game.p1.board.board;
    const enemyBoard = this.game.p2.board.board;

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const playerCell = this.playerBoard.children[y].children[x];
        const enemyCell = this.enemyBoard.children[y].children[x];

        if (playerBoard[y][x].ship) {
          playerCell.classList.add("boardShip");
        } else if (playerBoard[y][x].isHit) {
          playerCell.classList.add("boardHit");
        } else {
          playerCell.className = "cell";
        }

        if (enemyBoard[y][x].ship) {
          enemyCell.classList.add("boardShip");
        } else if (enemyBoard[y][x].isHit) {
          enemyCell.classList.add("boardHit");
        } else {
          enemyCell.className = "cell";
        }
      }
    }
  };

  makeTurn = (e) => {
    const cell = e.target;
    if (!cell.classList.contains("cell")) return;

    const [y, x] = this.getCellCoordinates(cell);

    const playerResult = this.game.makeTurn(y, x);
    if (!playerResult) return;
    console.log(`You attacked ${y} ${x}`);
    console.log(playerResult);

    let winner = this.game.checkWinner();
    if (winner) {
      this.displayEndScreen(winner);
      return;
    }

    console.log("Enemy is attacking...");
    const enemyResult = this.game.autoTurn();
    console.log(enemyResult);
    this.updateBoards();

    winner = this.game.checkWinner();
    if (winner) {
      this.displayEndScreen(winner);
    }
  };

  getCellCoordinates = (cell) => {
    const row = cell.parentElement;
    const x = [...row.children].indexOf(cell);
    const y = [...this.enemyBoard.children].indexOf(row);

    return [y, x];
  };

  displayEndScreen = (winner) => {
    this.modalOverlay.classList.remove("hidden");

    const resultText = this.modalOverlay.querySelector("p");
    resultText.textContent =
      winner.name === this.game.p1.name ? "You won!" : "You lost!";

    const playagainBtn = this.modalOverlay.querySelector("button");

    playagainBtn.addEventListener("click", () => {
      this.modalOverlay.classList.add("hidden");
    });
  };
}

export default DisplayController;
