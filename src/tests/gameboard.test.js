import { test, expect } from "vitest";
import Gameboard from "../gameboard";
import Ship from "../ship";

test("Gameboard init", () => {
  const gameboard = new Gameboard();
  expect(gameboard.board.length).toBe(10);
  expect(gameboard.board[0].length).toBe(10);
});

test("Place ship horizontal", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(3, 4, 4);
  expect(gameboard.board[3][4].ship).toBeInstanceOf(Ship);
  expect(gameboard.board[3][4].ship.length).toBe(4);
  expect(gameboard.board[3][5].ship).toMatchObject(gameboard.board[3][4].ship);
  expect(gameboard.board[3][6].ship).toMatchObject(gameboard.board[3][4].ship);
  expect(gameboard.board[3][7].ship).toMatchObject(gameboard.board[3][4].ship);
  expect(gameboard.ships[0]).toMatchObject(gameboard.board[3][4].ship);
  expect(gameboard.board[3][8].ship).toBeNull();
  expect(gameboard.placeShip(3, 4, 4)).toBeNull();
  expect(gameboard.placeShip(3, 8, 4)).toBeNull();
  expect(gameboard.placeShip(3, 8, 4)).toBeNull();

  // if ships on border corner
  expect(gameboard.placeShip(4, 3, 1)).toBeNull();
  expect(gameboard.placeShip(2, 3, 1)).toBeNull();
  expect(gameboard.placeShip(2, 8, 1)).toBeNull();
  expect(gameboard.placeShip(4, 8, 1)).toBeNull();

  // place ship in corner
  expect(gameboard.placeShip(9, 0, 3)).not.toBeNull();
  expect(gameboard.placeShip(0, 0, 3)).not.toBeNull();
  expect(gameboard.placeShip(0, 7, 3)).not.toBeNull();
  expect(gameboard.placeShip(9, 7, 3)).not.toBeNull();
});

test("Place ship vertical", () => {
  const gameboard = new Gameboard();
  const sh = gameboard.placeShip(3, 4, 4, false);
  expect(gameboard.board[3][4].ship).toBe(sh);
  expect(gameboard.board[4][4].ship).toBe(sh);
  expect(gameboard.board[5][4].ship).toBe(sh);
  expect(gameboard.board[6][4].ship).toBe(sh);
  expect(gameboard.placeShip(2, 4, 4, false)).toBeNull();
  expect(gameboard.placeShip(1, 5, 2)).toBeInstanceOf(Ship);

  // if ships on border corner
  expect(gameboard.placeShip(2, 3, 1)).toBeNull();
  expect(gameboard.placeShip(2, 5, 1)).toBeNull();
  expect(gameboard.placeShip(7, 3, 1)).toBeNull();
  expect(gameboard.placeShip(7, 5, 1)).toBeNull();

  // place ship in corner
  expect(gameboard.placeShip(7, 9, 3, false)).not.toBeNull();
  expect(gameboard.placeShip(0, 9, 3, false)).not.toBeNull();
  expect(gameboard.placeShip(7, 0, 3, false)).not.toBeNull();
  expect(gameboard.placeShip(0, 0, 3, false)).not.toBeNull();
});
