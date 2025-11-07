import { Battlefield } from "../src/battleSpace.js";
import { Ship } from "../src/battleSpace.js";

describe("Battlefield setup", () => {
  test("creates all ships correctly", () => {
    const shipsData = [
      { size: 3, x: 0, y: 0, orientation: "horizontal" },
      { size: 2, x: 0, y: 2, orientation: "vertical" }
    ];
    const bf = new Battlefield(10, 10, shipsData);
    expect(bf.ships.length).toBe(2);
    expect(bf.ships[0]).toBeInstanceOf(Ship);
  });

  test("throws error for ship exceeding boundary", () => {
    const shipsData = [{ size: 5, x: 8, y: 0, orientation: "horizontal" }];
    expect(() => new Battlefield(10, 10, shipsData))
      .toThrow(/exceeds field boundaries/);
  });

  test("throws error for overlapping ships", () => {
    const shipsData = [
      { size: 3, x: 0, y: 0, orientation: "horizontal" },
      { size: 2, x: 1, y: 0, orientation: "horizontal" } // overlaps
    ];
    expect(() => new Battlefield(10, 10, shipsData))
      .toThrow(/overlap/);
  });
});

describe("Battlefield firing", () => {
  let bf;
  beforeEach(() => {
    const shipsData = [{ size: 2, x: 0, y: 0, orientation: "horizontal" }];
    bf = new Battlefield(5, 5, shipsData);
  });

  test("returns missed_ocean for out-of-bounds", () => {
    const result = bf.fire(10, 10);
    expect(result.result).toBe("missed_ocean");
  });

  test("registers a hit", () => {
    const result = bf.fire(0, 0);
    expect(result.result).toBe("hit");
  });

  test("sinks the ship on final hit", () => {
    bf.fire(0, 0);
    const result = bf.fire(1, 0);
    expect(result.result).toBe("sunk");
  });

  test("marks duplicate shot", () => {
    bf.fire(0, 0);
    const result = bf.fire(0, 0);
    expect(result.result).toBe("duplicate");
  });

  test("misses when no ship in cell", () => {
    const result = bf.fire(4, 4);
    expect(result.result).toBe("miss");
  });
});


describe("Battlefield fleet status", () => {
  test("shows each ship's correct status", () => {
    const shipsData = [{ size: 2, x: 0, y: 0, orientation: "horizontal" }];
    const bf = new Battlefield(5, 5, shipsData);

    let status = bf.getFleetStatus()[0];
    expect(status.status).toBe("AFLOAT");

    bf.fire(0, 0);
    bf.fire(1, 0);

    status = bf.getFleetStatus()[0];
    expect(status.status).toBe("SUNK");
    expect(status.hits).toBe("2/2");
  });
});