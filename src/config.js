export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 10;
export const SHIP_SIZES = [5, 4, 3, 3, 2];

function createRandomShipLayout(shipSizes, width, height) {

    const layout = [
        { size: 5, x: 0, y: 0, orientation: 'horizontal' }, // Carrier
        { size: 4, x: 7, y: 3, orientation: 'vertical' },   // Battleship
        { size: 3, x: 2, y: 5, orientation: 'horizontal' }, // Cruiser
        { size: 3, x: 8, y: 0, orientation: 'vertical' },   // Submarine
        { size: 2, x: 4, y: 9, orientation: 'horizontal' }  // Destroyer
    ];
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