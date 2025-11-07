// tests/Ship.test.js
import { Ship } from "../src/battleSpace.js";

describe("Ship class", () => {
  test("initializes correctly", () => {
    const ship = new Ship(1, 3, 2, 4, "Vertical");
    expect(ship.id).toBe(1);
    expect(ship.size).toBe(3);
    expect(ship.hits).toBe(0);
    expect(ship.isSunk).toBe(false);
    expect(ship.orientation).toBe("vertical");
  });

  test("takeHit increases hits and sinks ship", () => {
    const ship = new Ship(1, 2, 0, 0);
    let result = ship.takeHit();
    expect(result.status).toBe("hit");
    expect(ship.hits).toBe(1);
    expect(ship.isSunk).toBe(false);

    result = ship.takeHit();
    expect(result.status).toBe("sunk");
    expect(ship.isSunk).toBe(true);
  });

  test("takeHit does nothing if already sunk", () => {
    const ship = new Ship(1, 1, 0, 0);
    ship.takeHit(); // sinks it
    const result = ship.takeHit();
    expect(result.message).toBe("Ship already sunk");
    expect(ship.hits).toBe(1);
  });

  test("occupiesCell for horizontal ship", () => {
    const ship = new Ship(1, 3, 2, 4, "horizontal");
    expect(ship.occupiesCell(2, 4)).toBe(true);
    expect(ship.occupiesCell(3, 4)).toBe(true);
    expect(ship.occupiesCell(4, 4)).toBe(true);
    expect(ship.occupiesCell(5, 4)).toBe(false);
    expect(ship.occupiesCell(2, 5)).toBe(false);
  });

  test("occupiesCell for vertical ship", () => {
    const ship = new Ship(1, 3, 2, 4, "vertical");
    expect(ship.occupiesCell(2, 4)).toBe(true);
    expect(ship.occupiesCell(2, 5)).toBe(true);
    expect(ship.occupiesCell(2, 6)).toBe(true);
    expect(ship.occupiesCell(3, 4)).toBe(false);
  });
});
