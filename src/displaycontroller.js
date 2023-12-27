import Game from "./game";

class DisplayController {
  constructor() {
    this.game = new Game();
    this.init();
  }

  init = () => {
    this.content = document.getElementById("content");
    this.modalOverlay = document.querySelector(".modalOverlay");
    this.createStatus();
    this.createBoards();
    this.createFleetCounters();

    this.enemyBoard.addEventListener("click", (e) => {
      if (!this.isRunning) this.makeTurn(e);
    });
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

        if (playerBoard[y][x].isHit) {
          playerCell.classList.add("boardHit");
        }

        if (enemyBoard[y][x].ship) {
          enemyCell.classList.add("boardShip");
        } else {
          enemyCell.className = "cell";
        }
        if (enemyBoard[y][x].isHit) {
          enemyCell.classList.add("boardHit");
        }
      }
    }
  };

  createFleetCounters = () => {
    this.playerFleetContainer = this.createFleetCounter(
      this.game.p1.getFleet(),
    );
    this.enemyFleetContainer = this.createFleetCounter(this.game.p2.getFleet());
    this.content.insertBefore(this.playerFleetContainer, this.playerBoard);
    this.content.insertBefore(this.enemyFleetContainer, this.enemyBoard);
  };

  createFleetCounter = (fleet) => {
    const fleetContainer = document.createElement("div");
    fleetContainer.className = "fleetContainer";

    Object.keys(fleet).forEach((key) => {
      const number = fleet[key];
      const shipDiv = document.createElement("div");
      shipDiv.className = "shipDiv";
      const shipCounter = document.createElement("span");
      shipCounter.className = "shipCounter";
      shipCounter.textContent = `x ${number}`;
      for (let i = 0; i < key; i++) {
        const shipCell = document.createElement("div");
        shipCell.className = "shipCell";
        shipDiv.appendChild(shipCell);
      }
      shipDiv.appendChild(shipCounter);
      fleetContainer.appendChild(shipDiv);
    });
    this.updateFleetCounter(fleetContainer, fleet);
    return fleetContainer;
  };

  updateFleetCounter = (fleetContainer, fleet) => {
    [...fleetContainer.children].forEach((shipType) => {
      const len = shipType.children.length - 1;
      if (!fleet[len]) {
        shipType.remove();
      } else {
        shipType.querySelector(".shipCounter").textContent = `x ${fleet[len]}`;
      }
    });
  };

  makeTurn = async (e) => {
    const cell = e.target;
    if (!cell.classList.contains("cell")) return;
    this.isRunning = true;

    const [y, x] = this.getCellCoordinates(cell);

    const playerResult = this.game.makeTurn(y, x);
    if (!playerResult) {
      this.isRunning = false;
      return;
    }
    this.updateBoards();
    this.updateFleetCounter(this.playerFleetContainer, this.game.p1.getFleet());
    await this.setStatus(this.getResultText(playerResult));

    let winner = this.game.checkWinner();
    if (winner) {
      this.displayEndScreen(winner);
      return;
    }

    const enemyResult = this.game.autoTurn();
    this.updateBoards();
    this.updateFleetCounter(this.enemyFleetContainer, this.game.p2.getFleet());
    await this.setStatus(this.getResultText(enemyResult));

    winner = this.game.checkWinner();
    if (winner) {
      this.displayEndScreen(winner);
    }
    this.isRunning = false;
    await this.setStatus("Your turn");
  };

  getResultText = (result) => {
    if (this.game.oppositePlayer === this.game.p1) {
      switch (result) {
        case "miss":
          return `You have missed`;
        case "hit":
          return `You have hit their ship`;
        case "sunk":
          return `You have sunk their ship`;
        default:
      }
    } else {
      switch (result) {
        case "miss":
          return `They have missed`;
        case "hit":
          return `They have hit your ship`;
        case "sunk":
          return `They have sunk your ship`;
        default:
      }
    }
    return "";
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

    playagainBtn.addEventListener("click", this.resetGame);
  };

  resetGame = () => {
    this.modalOverlay.classList.add("hidden");
    this.content.innerHTML = "";
    this.game = new Game();
    this.init();
  };

  createStatus = () => {
    const statusDiv = document.createElement("div");
    statusDiv.className = "status";

    const prompt = document.createElement("p");
    prompt.className = "prompt";
    prompt.textContent = `[${this.game.p1.name}@arthurbais.com] ~/games/battleship.js $`;

    this.status = document.createElement("p");
    this.status.className = "statusText";
    this.status.textContent = "Click on the enemy board to attack...";
    statusDiv.appendChild(prompt);
    statusDiv.appendChild(this.status);
    this.content.appendChild(statusDiv);
  };

  setStatus = async (...text) =>
    new Promise((resolve) => {
      const onAnimationEndCb = () => {
        this.status.removeEventListener("animationend", onAnimationEndCb);
        resolve();
      };
      // reset animation
      this.status.classList.remove("statusText");
      void this.status.offsetWidth;
      this.status.addEventListener("animationend", onAnimationEndCb);
      this.status.classList.add("statusText");
      this.status.textContent = `${text}…`;
    });
}

export default DisplayController;
