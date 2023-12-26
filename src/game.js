import Player from "./player";

class Game {
  constructor() {
    this.p1 = new Player("Player 1");
    this.p2 = new Player("AI");
    this.p1.placeFleet(Game.fleet);
    this.p2.placeFleet(Game.fleet);
    this.currentPlayer = this.p1;
    this.oppositePlayer = this.p2;
  }

  swapPlayers = () => {
    this.currentPlayer = this.currentPlayer === this.p1 ? this.p2 : this.p1;
    this.oppositePlayer = this.oppositePlayer === this.p1 ? this.p2 : this.p1;
  };

  makeTurn = (y, x) => {
    const res = this.currentPlayer.attack(y, x, this.oppositePlayer.board);
    this.swapPlayers();
    return res;
  };

  autoTurn = () => {
    const res = this.currentPlayer.randAttack(this.oppositePlayer.board);
    this.swapPlayers();
    return res;
  };

  checkWinner = () => {
    if (this.currentPlayer.board.isGameOver()) return this.oppositePlayer;
    return false;
  };

  printBoards = () => {
    const b1 = this.p1.board.board;
    const b2 = this.p2.board.board;
    console.log("Player 1 \t\t\t Player2");
    console.log("  0 1 2 3 4 5 6 7 8 9 x\t\t  0 1 2 3 4 5 6 7 8 9 x");
    for (let i = 0; i < 10; i++) {
      let str = "";
      let str1 = i;
      let str2 = i;
      for (let j = 0; j < 10; j++) {
        let ch1 = " _";
        let ch2 = " _";
        const sh = " \x1b[32ms\x1b[0m";
        if (b1[i][j].ship) ch1 = sh;
        if (b1[i][j].isHit) ch1 = " *";
        if (b1[i][j].ship && b1[i][j].isHit) ch1 = " \x1b[31md\x1b[0m";
        if (b2[i][j].ship) ch2 = sh;
        if (b2[i][j].isHit) ch2 = " *";
        if (b2[i][j].ship && b2[i][j].isHit) ch2 = " \x1b[31md\x1b[0m";
        str1 += ch1;
        str2 += ch2;
      }
      str += `${str1}\t\t${str2}`;
      console.log(str);
    }
  };

  static fleet = {
    2: 1,
    3: 2,
    4: 1,
    5: 2,
  };
}

export default Game;
