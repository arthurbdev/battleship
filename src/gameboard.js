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

  placeShip = (y, x, len, h = true) => {
    if (this.validatePlacement(y, x, len)) {
      const ship = new Ship(len);
      this.ships.push(ship);
      for (let i = 0; i < len; i++) {
        this.board[y][x + i].ship = ship;
      }
      return ship;
    }
    return null;
  };

  validatePlacement = (y, x, len) => {
    const b = this.board;
    const bool =
      b[y].slice(x, x + len).every(
        (cell, i) =>
          cell && // cell exists
          !cell.ship && // no ship on cell
          !b[y - 1][x + i].ship && // no ship above or below
          !b[y + 1][x + i].ship,
      ) &&
      !b[y][x - 1].ship && // no ship to the left or to the right
      !b[y][x + len + 1].ship;
    return bool;
  };
}

export default Gameboard;
