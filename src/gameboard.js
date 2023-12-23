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
    if (this.validatePlacement(y, x, len, h)) {
      const ship = new Ship(len);
      this.ships.push(ship);
      for (let i = 0; i < len; i++) {
        if (h) this.board[y][x + i].ship = ship;
        else this.board[y + i][x].ship = ship;
      }
      return ship;
    }
    return null;
  };

  validatePlacement = (y, x, len, h) => {
    const b = this.board;
    let bool;

    // use min and max to not go out of bounds of the array
    const boardMax = this.board.length - 1;
    const minX = Math.max(0, x - 1);
    const maxX = Math.min(boardMax, x + 1);
    const minY = Math.max(0, y - 1);
    const maxY = Math.min(boardMax, y + 1);
    const maxlenX = Math.min(boardMax + 1, x + len + 1);
    const maxlenY = Math.min(boardMax + 1, y + len + 1);

    if (h)
      bool = b[y]
        .slice(minX, maxlenX)
        .every(
          (cell, i, arr) =>
            !cell.ship &&
            !b[minY][minX + i].ship &&
            !b[maxY][minX + i].ship &&
            arr.length > len,
        );
    else
      bool = b
        .slice(minY, maxlenY)
        .every(
          (cell, i, arr) =>
            !cell[x].ship &&
            !b[minY + i][maxX].ship &&
            !b[minY + i][minX].ship &&
            arr.length > len,
        );
    return bool;
  };

  receiveAttack = (y, x) => {
    const cell = this.board[y][x];
    if (!cell.isHit) {
      cell.isHit = true;
      if (cell.ship) {
        cell.ship.hit();
        if (cell.ship.isSunk()) {
          return "sunk";
        }
        return "hit";
      }
      return "miss";
    }
    return null;
  };

  isGameOver = () => this.ships.every((sh) => sh.isSunk());

  printBoard = () => {
    console.log("  0 1 2 3 4 5 6 7 8 9 x");
    this.board.forEach((row, index) => {
      let str = "";
      str += index;
      for (let i = 0; i < row.length; i++) {
        let ch = " _";
        if (row[i].ship) {
          ch = " s";
        }
        if (row[i].isHit) {
          ch = " *";
        }
        str += ch;
      }
      console.log(str);
    });
    console.log("y");
  };
}

export default Gameboard;
