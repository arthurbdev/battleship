import Gameboard from "./gameboard";
import Player from "./player";
import Game from "./game";

const FLEET = {
  // length: num of ships
  2: 1,
  3: 2,
  4: 1,
  5: 2,
};

const player = new Player("Me");
player.placeFleet(FLEET);

const g = new Game();
const w = await g.newGame(player, FLEET);
console.log(`Winner is ${w.name}`);
