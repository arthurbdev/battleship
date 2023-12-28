import Game from "./game";

class DisplayController {
  constructor() {
    this.game = new Game();
    this.init();
  }

  init = () => {
    this.content = document.getElementById("content");
    this.modalOverlay = document.querySelector(".modalOverlay");
    this.endScreenModal = document.querySelector(".endScreenModal");
    this.startScreenModal = document.querySelector(".startScreenModal");
    this.showStartScreen();
  };

  startGame = () => {
    if (this.game.p1.isFleetPlaced(Game.fleet)) {
      this.modalOverlay.classList.add("hidden");
      this.startScreenModal.classList.add("hidden");
      this.startScreenBoard.remove();
      this.startScreenFleet.remove();

      this.createStatus();
      this.createBoards();
      this.createFleetCounters();

      this.isRunning = false;
      this.enemyBoard.addEventListener("click", (e) => {
        if (!this.isRunning) this.makeTurn(e);
      });
    }
  };

  showStartScreen = () => {
    this.modalOverlay.classList.remove("hidden");
    this.startScreenModal.classList.remove("hidden");

    this.startScreenBoard = this.createBoard();
    this.startScreenModal
      .querySelector(".left")
      .appendChild(this.startScreenBoard);
    this.startScreenFleet = this.createFleetCounter(Game.fleet);
    this.startScreenModal
      .querySelector(".right")
      .insertBefore(
        this.startScreenFleet,
        this.startScreenModal.querySelector(".messageBox"),
      );

    this.isHorizontal = true;
    const switchAxisBtn = document.querySelector(".switchAxisBtn");
    switchAxisBtn.addEventListener("click", this.switchAxis);

    this.addDraggableEventHandlers();

    const autoPlaceBtn = document.querySelector(".autoPlaceBtn");
    autoPlaceBtn.addEventListener("click", this.autoPlace);

    const startGameBtn = document.querySelector(".startGameBtn");
    startGameBtn.addEventListener("click", this.startGame);
    startGameBtn.classList.remove("shiny");

    const resetBtn = document.querySelector(".resetBtn");
    resetBtn.addEventListener("click", this.resetStartScreen);
  };

  resetStartScreen = () => {
    this.game.p1.resetBoard();
    this.updateBoard(this.startScreenBoard, this.game.p1.board.board);
    const newFleet = this.createFleetCounter(Game.fleet);
    this.startScreenModal
      .querySelector(".right")
      .replaceChild(newFleet, this.startScreenFleet);
    this.startScreenFleet = newFleet;
    const btn = document.querySelector(".switchAxisBtn");
    this.isHorizontal = true;
    btn.textContent = "Axis X";

    const startGameBtn = document.querySelector(".startGameBtn");
    startGameBtn.classList.remove("shiny");

    this.addDraggableEventHandlers();
  };

  switchAxis = (e) => {
    const btn = e.target;
    this.isHorizontal = !this.isHorizontal;
    if (this.isHorizontal) {
      btn.textContent = "Axis X";
      this.startScreenFleet.classList.remove("vertical");
    } else {
      btn.textContent = "Axis Y";
      this.startScreenFleet.classList.add("vertical");
    }
  };

  addDraggableEventHandlers = () => {
    [...this.startScreenFleet.children].forEach((child) => {
      const ship = child.firstChild;
      ship.setAttribute("draggable", "true");
      ship.addEventListener("dragstart", (e) => {
        this.selectedShip = ship.children.length;
      });
    });

    this.startScreenBoard.ondrop = (e) => {
      e.preventDefault();
      const [y, x] = this.getCellCoordinates(e.target);
      const len = this.selectedShip;
      const sh = this.game.p1.board.placeShip(y, x, len, this.isHorizontal);
      this.updateBoard(this.startScreenBoard, this.game.p1.board.board);
      const fleetremaining = this.game.p1.getUnplacedFleet(Game.fleet);
      this.updateFleetCounter(this.startScreenFleet, fleetremaining);
      if (Object.keys(fleetremaining).length === 0) {
        document.querySelector(".startGameBtn").classList.add("shiny");
      }
    };

    this.startScreenBoard.ondragover = (e) => {
      e.preventDefault();
      this.toggleOnHoverClass(e);
    };

    this.startScreenBoard.ondragleave = (e) => {
      this.toggleOnHoverClass(e, true);
    };
  };

  toggleOnHoverClass = (e, remove = false) => {
    const [y, x] = this.getCellCoordinates(e.target);
    const len = this.selectedShip;
    let classname;
    if (this.game.p1.board.validatePlacement(y, x, len, this.isHorizontal)) {
      classname = "valid";
    } else classname = "invalid";
    for (let i = 0; i < len; i++) {
      if (this.isHorizontal) {
        const index = Math.min(9, x + i);
        const el = this.startScreenBoard.children[y].children[index];
        if (remove) {
          el.classList.remove(classname);
        } else {
          el.classList.add(classname);
        }
      } else {
        const index = Math.min(9, y + i);
        const el = this.startScreenBoard.children[index].children[x];
        if (remove) {
          el.classList.remove(classname);
        } else {
          el.classList.add(classname);
        }
      }
    }
  };

  createBoard = () => {
    const board = document.createElement("div");
    board.className = "board";

    for (let i = 0; i < 10; i++) {
      const row = document.createElement("div");
      row.className = "row";
      for (let j = 0; j < 10; j++) {
        const cell = document.createElement("cell");
        cell.className = "cell";
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
    return board;
  };

  updateBoard(boardElement, board) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const playerCell = boardElement.children[y].children[x];
        playerCell.className = "cell";

        if (board[y][x].ship) {
          playerCell.classList.add("boardShip");
        } else {
          playerCell.className = "cell";
        }

        if (board[y][x].isHit) {
          playerCell.classList.add("boardHit");
        }
      }
    }
  }

  autoPlace = () => {
    this.game.p1.placeFleet(Game.fleet);
    this.updateBoard(this.startScreenBoard, this.game.p1.getBoard());
    this.startScreenModal.querySelector(".startGameBtn").classList.add("shiny");
    this.startScreenFleet.innerHTML = "";
  };

  createBoards = () => {
    this.playerBoard = this.createBoard();
    this.enemyBoard = this.createBoard();

    this.playerBoard.className = "playerBoard";
    this.enemyBoard.className = "enemyBoard";

    this.content.appendChild(this.playerBoard);
    this.content.appendChild(this.enemyBoard);

    this.updateBoard(this.playerBoard, this.game.p1.getBoard());
    this.updateBoard(this.enemyBoard, this.game.p2.getBoard());
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
      const ship = document.createElement("div");
      ship.className = "ship";
      const shipCounter = document.createElement("span");
      shipCounter.className = "shipCounter";
      shipCounter.textContent = `x ${number}`;
      for (let i = 0; i < key; i++) {
        const shipCell = document.createElement("div");
        shipCell.className = "shipCell";
        ship.appendChild(shipCell);
      }
      shipDiv.appendChild(ship);
      shipDiv.appendChild(shipCounter);
      fleetContainer.appendChild(shipDiv);
    });
    this.updateFleetCounter(fleetContainer, fleet);
    return fleetContainer;
  };

  updateFleetCounter = (fleetContainer, fleet) => {
    [...fleetContainer.children].forEach((shipType) => {
      const ship = shipType.firstChild;
      const len = ship.children.length;
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
    this.updateBoard(this.enemyBoard, this.game.p2.getBoard());
    this.updateFleetCounter(this.enemyFleetContainer, this.game.p2.getFleet());
    await this.setStatus(this.getResultText(playerResult));

    let winner = this.game.checkWinner();
    if (winner) {
      this.displayEndScreen(winner);
      return;
    }

    const enemyResult = this.game.autoTurn();
    this.updateBoard(this.playerBoard, this.game.p1.getBoard());
    this.updateFleetCounter(this.playerFleetContainer, this.game.p1.getFleet());
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
          return `The enemy has missed`;
        case "hit":
          return `The enemy has hit your ship`;
        case "sunk":
          return `The enemy has sunk your ship`;
        default:
      }
    }
    return "";
  };

  getCellCoordinates = (cell) => {
    const row = cell.parentElement;
    const x = [...row.children].indexOf(cell);
    const y = [...row.parentElement.children].indexOf(row);

    return [y, x];
  };

  displayEndScreen = (winner) => {
    this.modalOverlay.classList.remove("hidden");
    this.endScreenModal.classList.remove("hidden");

    const resultText = this.endScreenModal.querySelector("p");
    resultText.textContent =
      winner.name === this.game.p1.name ? "You won!" : "You lost!";

    const playagainBtn = this.modalOverlay.querySelector(".playAgainBtn");

    playagainBtn.addEventListener("click", this.resetGame);
  };

  resetGame = () => {
    this.modalOverlay.classList.add("hidden");
    this.endScreenModal.classList.add("hidden");
    this.content.innerHTML = "";
    this.game = new Game();
    this.init();
  };

  createStatus = () => {
    const statusDiv = document.createElement("div");
    statusDiv.className = "status";

    const prompt = document.createElement("p");
    prompt.className = "prompt";
    prompt.innerHTML = `<span class="green">${this.game.p1.name}</span>@<span class="lightblue">arthurbais.com</span>: <span class="blue">~/games/battleship.js</span> $`;

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
