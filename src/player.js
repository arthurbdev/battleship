import Gameboard from "./gameboard";

class Player {
  constructor(name) {
    this.board = new Gameboard();
    this.name = name;
  }

  attack = (y, x, target) => target.receiveAttack(y, x);

}

export default Player;
