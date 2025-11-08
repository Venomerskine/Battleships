import { Player } from "../src/battleSpace.js";
import { Battlefield } from "../src/battleSpace.js";

describe("Player class", () => {
  let player1, player2;

  beforeEach(() => {
    const config1 = {
      width: 5,
      height: 5,
      ships: [{ size: 2, x: 0, y: 0, orientation: "horizontal" }]
    };
    const config2 = {
      width: 5,
      height: 5,
      ships: [{ size: 1, x: 2, y: 2, orientation: "horizontal" }]
    };

    player1 = new Player("Alice", false, config1);
    player2 = new Player("Bot", true, config2);
  });

  // --- Constructor tests ---
  test("initializes correctly", () => {
    expect(player1.name).toBe("Alice");
    expect(player1.isComputer).toBe(false);
    expect(player1.battlefield).toBeInstanceOf(Battlefield);
    expect(player1.previousShots.size).toBe(0);
  });

  // --- fireAt() tests ---
  test("fires and registers result on opponent battlefield", () => {
    const result = player1.fireAt(player2, 2, 2);
    expect(result.attacker).toBe("Alice");
    expect(["hit", "sunk", "miss"]).toContain(result.result);
  });

  test("prevents duplicate firing", () => {
    player1.fireAt(player2, 1, 1);
    const result = player1.fireAt(player2, 1, 1);
    expect(result.result).toBe("duplicate");
  });

  // --- getRandomTarget() tests ---
  test("returns a valid random coordinate", () => {
    const target = player1.getRandomTarget();
    expect(target.x).toBeGreaterThanOrEqual(0);
    expect(target.x).toBeLessThan(player1.battlefield.width);
    expect(target.y).toBeGreaterThanOrEqual(0);
    expect(target.y).toBeLessThan(player1.battlefield.height);
  });

  test("never returns the same coordinate twice in a row", () => {
    const first = player1.getRandomTarget();
    player1.previousShots.add(`${first.x},${first.y}`);
    const second = player1.getRandomTarget();
    expect(`${second.x},${second.y}`).not.toBe(`${first.x},${first.y}`);
  });

  // --- autoFire() tests ---
  test("computer player auto fires successfully", () => {
    const result = player2.autoFire(player1);
    expect(result.attacker).toBe("Bot");
    expect(result).toHaveProperty("result");
  });

  test("throws error if non-computer tries autoFire", () => {
    expect(() => player1.autoFire(player2)).toThrow(/not a computer/);
  });

  // --- hasLost() tests ---
  test("detects loss correctly", () => {
    expect(player2.hasLost()).toBe(false);
    player1.fireAt(player2, 2, 2); // sink the only ship
    expect(player2.hasLost()).toBe(true);
  });
});
