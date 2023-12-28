import Gameboard from "./gameboard";

class Player {
  constructor(name) {
    this.board = new Gameboard();
    this.name = name;
  }

  attack = (y, x, target) => target.receiveAttack(y, x);

  randAttack = (target) => {
    const maxW = target.board.length;
    let res = null;
    while (res === null) {
      const x = Math.floor(Math.random() * maxW);
      const y = Math.floor(Math.random() * maxW);
      res = target.receiveAttack(y, x);
    }
    return res;
  };

  placeFleet = (fleet) => {
    if (this.board.ships) this.resetBoard();
    const maxW = this.board.board.length;
    const keys = Object.keys(fleet);
    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i];
      for (let j = 0; j < fleet[key]; j++) {
        const y = Math.floor(Math.random() * maxW);
        const x = Math.floor(Math.random() * maxW);
        const h = Math.random() < 0.5;
        if (!this.board.placeShip(y, x, parseInt(key, 10), h)) {
          j--;
        }
      }
    }
  };

  getFleet = () => {
    const fleet = {};
    this.board.ships.forEach((ship) => {
      if (!ship.isSunk()) {
        fleet[ship.length] = fleet[ship.length] ? ++fleet[ship.length] : 1;
      }
    });
    return fleet;
  };

  getUnplacedFleet = (defaultFleet) => {
    const placedFleet = this.getFleet();
    const res = {};
    Object.keys(defaultFleet).forEach((key) => {
      if (placedFleet[key]) {
        const num = defaultFleet[key] - placedFleet[key];
        if (num > 0) {
          res[key] = num;
        }
      } else {
        res[key] = defaultFleet[key];
      }
    });
    return res;
  };

  isFleetPlaced = (defaultFleet) =>
    Object.keys(this.getUnplacedFleet(defaultFleet)).length === 0;

  resetBoard = () => {
    this.board = new Gameboard();
  };

  getBoard = () => this.board.board;
}

export default Player;
