export class Ship {
    constructor(id, size, startX, startY, orientation = 'horizontal') {
        this.id = id;
        this.size = size;
        this.hits = 0;
        this.isSunk = false;
        this.startX = startX;
        this.startY = startY;
        this.orientation = orientation.toLowerCase(); // 'horizontal' or 'vertical'
    }

    takeHit() {
        if (this.isSunk) return { status: "sunk", message: "Ship already sunk" };

        this.hits++;
        if (this.hits >= this.size) {
            this.isSunk = true;
            return { status: "sunk", message: "Ship sunk!" };
        }
        return { status: "hit", message: "Ship hit!" };
    }

    occupiesCell(x, y) {
        if (this.orientation === 'horizontal') {
            return y === this.startY && x >= this.startX && x < this.startX + this.size;
        } else {
            return x === this.startX && y >= this.startY && y < this.startY + this.size;
        }
    }
}

export class Battlefield {
    constructor(width, height, shipsData) {
        this.width = width;
        this.height = height;
        this.ships = [];
        this.attacks = new Set();

        let shipId = 1;
        for (const data of shipsData) {
            const { size, x, y, orientation } = data;

            // Bounds check
            if (orientation === 'horizontal' && x + size > width ||
                orientation === 'vertical' && y + size > height) {
                throw new Error(`Ship at (${x}, ${y}) with size ${size} exceeds field boundaries.`);
            }

            // Overlap check
            const overlaps = this.ships.some(s => {
                for (let i = 0; i < size; i++) {
                    const cx = orientation === 'horizontal' ? x + i : x;
                    const cy = orientation === 'vertical' ? y + i : y;
                    if (s.occupiesCell(cx, cy)) return true;
                }
                return false;
            });
            if (overlaps) throw new Error(`Ship overlap at (${x}, ${y}).`);

            const ship = new Ship(shipId++, size, x, y, orientation);
            this.ships.push(ship);
        }
    }

    fire(x, y) {
        // Bounds check
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return { result: "missed_ocean", message: `Shot at (${x}, ${y}) missed the battlefield.` };
        }

        const key = `${x},${y}`;
        if (this.attacks.has(key)) {
            return { result: "duplicate", message: `Shot at (${x}, ${y}) was already fired.` };
        }
        this.attacks.add(key);

        for (const ship of this.ships) {
            if (!ship.isSunk && ship.occupiesCell(x, y)) {
                const outcome = ship.takeHit();
                return {
                    result: outcome.status,
                    message: `Shot at (${x}, ${y}) → ${outcome.message} (Ship ID ${ship.id}, Size ${ship.size})`
                };
            }
        }

        return { result: "miss", message: `Shot at (${x}, ${y}) missed all ships.` };
    }

    checkVictory() {
        const allSunk = this.ships.every(s => s.isSunk);
        return {
            allSunk,
            remaining: this.ships.filter(s => !s.isSunk).length
        };
    }

    getFleetStatus() {
        return this.ships.map(s => ({
            id: s.id,
            size: s.size,
            orientation: s.orientation,
            start: { x: s.startX, y: s.startY },
            hits: `${s.hits}/${s.size}`,
            status: s.isSunk ? "SUNK" : "AFLOAT"
        }));
    }
}

export class Player {
    constructor(name, isComputer = false, battlefieldConfig) {
        this.name = name;
        this.isComputer = isComputer;
        this.battlefield = new Battlefield(
            battlefieldConfig.width,
            battlefieldConfig.height,
            battlefieldConfig.ships
        );
        this.previousShots = new Set(); // Track fired coordinates
    }

    /**
     * Fire at a coordinate on the opponent's battlefield.
     * @param {Player} opponent - The opposing player.
     * @param {number} x - X-coordinate of the shot.
     * @param {number} y - Y-coordinate of the shot.
     * @returns {object} - Result of the shot.
     */
    fireAt(opponent, x, y) {
        const key = `${x},${y}`;

        if (this.previousShots.has(key)) {
            return { result: "duplicate", message: `${this.name} already fired at (${x}, ${y}).` };
        }

        this.previousShots.add(key);
        const result = opponent.battlefield.fire(x, y);
        return { attacker: this.name, ...result };
    }

    /**
     * Generates a random valid target (for computer player).
     * Ensures no duplicate firing.
     * @returns {object} { x, y }
     */
    getRandomTarget() {
        const width = this.battlefield.width;
        const height = this.battlefield.height;
        let x, y, key;

        do {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
            key = `${x},${y}`;
        } while (this.previousShots.has(key));

        return { x, y };
    }

    /**
     * Computer automatically fires on the opponent.
     * @param {Player} opponent
     * @returns {object} - Result of the shot.
     */
    autoFire(opponent) {
        if (!this.isComputer) {
            throw new Error(`${this.name} is not a computer player.`);
        }
        const { x, y } = this.getRandomTarget();
        return this.fireAt(opponent, x, y);
    }

    /**
     * Checks if all ships are sunk.
     * @returns {boolean}
     */
    hasLost() {
        return this.battlefield.checkVictory().allSunk;
    }
}



