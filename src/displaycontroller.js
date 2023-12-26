import Game from "./game";

class DisplayController {
  constructor() {
    this.game = new Game();
    this.init();
  }

  init = () => {
    this.content = document.getElementById("content");
    this.createBoards();
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
        } else {
          playerCell.className = "cell";
        }

        if (enemyBoard[y][x].ship) {
          enemyCell.classList.add("boardShip");
        } else {
          enemyCell.className = "cell";
        }
      }
    }
  };
}

export default DisplayController;
