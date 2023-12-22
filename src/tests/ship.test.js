import { test, expect } from "vitest";
import Ship from "../ship";

test("Create a ship with a length of 4", () => {
  expect(new Ship(4).length).toBe(4);
});

test("Test ship sinking", () => {
  const ship = new Ship(4);
  ship.hit();
  ship.hit();
  expect(ship.hp).toBe(2);
  expect(ship.isSunk()).toBeFalsy();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBeTruthy();
  expect(ship.hp).toBe(0);
});
