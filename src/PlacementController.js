import { SHIP_SIZES, BOARD_WIDTH, BOARD_HEIGHT } from './config.js';

export class PlacementController {
  constructor(game, boardId) {
    this.game = game;
    this.boardElement = document.getElementById(boardId);
    this.currentShipIndex = 0;
    this.orientation = 'horizontal';
    this.placements = [];
    
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'r') {
        this.orientation = this.orientation === 'horizontal' ? 'vertical' : 'horizontal';
      }
    });

    this.boardElement.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(e) {
    if (!e.target.matches('div')) return;
    if (this.currentShipIndex >= SHIP_SIZES.length) return;

    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);
    const size = SHIP_SIZES[this.currentShipIndex];

    if (this.isValidPlacement(x, y, size)) {
      this.placeShip(x, y, size);
      this.currentShipIndex++;
    }

    if (this.currentShipIndex >= SHIP_SIZES.length) {
      this.boardElement.removeEventListener('click', this.handleClick);
      this.game.startGame(this.placements);
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
    this.placements.push({ x, y, size, orientation: this.orientation });

    for (let i = 0; i < size; i++) {
      const divX = this.orientation === 'horizontal' ? x + i : x;
      const divY = this.orientation === 'vertical' ? y + i : y;
      const cell = this.boardElement.querySelector(`[data-x="${divX}"][data-y="${divY}"]`);
      cell.style.backgroundColor = 'lightgreen';
    }
  }

  enable(){

  }
  
getHumanLayout() {
  return this.placements;
}
}
