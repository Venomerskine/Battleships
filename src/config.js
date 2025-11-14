export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 10;
export const SHIP_SIZES = [5, 4, 3, 3, 2];

function createRandomShipLayout(shipSizes, width, height) {
  const layout = [];

  for (const size of shipSizes) {
    let placed = false;

    while (!placed) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      // Check if ship fits inside board
      if (orientation === 'horizontal' && x + size > width) continue;
      if (orientation === 'vertical' && y + size > height) continue;

      // Check for overlap with existing ships
      const overlaps = layout.some(ship => {
        for (let i = 0; i < size; i++) {
          const newX = orientation === 'horizontal' ? x + i : x;
          const newY = orientation === 'vertical' ? y + i : y;
          for (let j = 0; j < ship.size; j++) {
            const shipX = ship.orientation === 'horizontal' ? ship.x + j : ship.x;
            const shipY = ship.orientation === 'vertical' ? ship.y + j : ship.y;
            if (newX === shipX && newY === shipY) return true;
          }
        }
        return false;
      });

      if (!overlaps) {
        layout.push({ size, x, y, orientation });
        placed = true;
      }
    }
  }

  return layout;
}

export const HUMAN_SHIP_LAYOUT = [
    { size: 5, x: 2, y: 2, orientation: 'horizontal' },
    { size: 4, x: 5, y: 5, orientation: 'vertical' },
    { size: 3, x: 0, y: 9, orientation: 'horizontal' },
    { size: 3, x: 9, y: 0, orientation: 'vertical' },
    { size: 2, x: 0, y: 0, orientation: 'vertical' }
];

export const COMPUTER_SHIP_LAYOUT = createRandomShipLayout(SHIP_SIZES, BOARD_WIDTH, BOARD_HEIGHT);