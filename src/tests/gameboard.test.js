import { test, expect } from "vitest";
import Gameboard from "../gameboard";

test("Gameboard init", () => {
  const gameboard = new Gameboard();
  expect(gameboard.board.length).toBe(10);
  expect(gameboard.board[0].length).toBe(10);
});

