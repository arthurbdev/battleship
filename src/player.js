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

}

export default Player;
