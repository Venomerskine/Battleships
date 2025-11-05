class Ship {
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