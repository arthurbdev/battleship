import Ship from "./ship";

class Gameboard {
  constructor() {
    this.board = [];
    this.ships = [];
    this.initializeBoard();
  }

  initializeBoard = () => {
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i].push({ isHit: false, ship: null });
      }
    }
  };

}

export default Gameboard;
