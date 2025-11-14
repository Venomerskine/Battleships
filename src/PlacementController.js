import { SHIP_SIZES, BOARD_WIDTH, BOARD_HEIGHT } from './config.js';

export class PlacementController {
  constructor(game, boardId) {
    this.game = game;
    this.boardElement = document.getElementById(boardId);

    if (!this.boardElement) {
      throw new Error(`PlacementController: board element "${boardId}" not found.`);
    }

    this.currentShipIndex = 0;
    this.orientation = 'horizontal';
    this.placements = [];
    this.handleClickBound = this.handleClick.bind(this);
    this.handleRotateBound = this.handleRotate.bind(this);
  }

  enable() {
    this.boardElement.addEventListener('click', this.handleClickBound);
    document.addEventListener('keydown', this.handleRotateBound);
  }

  disable() {
    this.boardElement.removeEventListener('click', this.handleClickBound);
    document.removeEventListener('keydown', this.handleRotateBound);
  }

  handleRotate(e) {
    if (e.key.toLowerCase() === 'r') {
      this.orientation =
        this.orientation === 'horizontal' ? 'vertical' : 'horizontal';
    }
  }

  handleClick(e) {
    if (!e.target.matches('div')) return;
    if (this.currentShipIndex >= SHIP_SIZES.length) return;

    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);
    const size = SHIP_SIZES[this.currentShipIndex];

    if (!this.isValidPlacement(x, y, size)) return;

    this.placeShip(x, y, size);
    this.currentShipIndex++;

    if (this.currentShipIndex >= SHIP_SIZES.length) {
      this.disable();
      this.game.startGame(this.getHumanLayout());
    }
  }

  isValidPlacement(x, y, size) {
    if (this.orientation === 'horizontal' && x + size > BOARD_WIDTH) return false;
    if (this.orientation === 'vertical' && y + size > BOARD_HEIGHT) return false;

    for (const ship of this.placements) {
      for (let i = 0; i < size; i++) {
        const newX = this.orientation === 'horizontal' ? x + i : x;
        const newY = this.orientation === 'vertical' ? y + i : y;

        for (let j = 0; j < ship.size; j++) {
          const shipX = ship.orientation === 'horizontal' ? ship.x + j : ship.x;
          const shipY = ship.orientation === 'vertical' ? ship.y + j : ship.y;
          if (newX === shipX && newY === shipY) return false;
        }
      }
    }

    return true;
  }

  placeShip(x, y, size) {
    this.placements.push({
      x,
      y,
      size,
      orientation: this.orientation,
    });

    for (let i = 0; i < size; i++) {
      const px = this.orientation === 'horizontal' ? x + i : x;
      const py = this.orientation === 'vertical' ? y + i : y;
      const cell = this.boardElement.querySelector(
        `[data-x="${px}"][data-y="${py}"]`
      );
      if (cell) cell.style.backgroundColor = 'lightgreen';
    }
  }

  getHumanLayout() {
    return this.placements;
  }
}

