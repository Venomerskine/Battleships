import { Ship, Battlefield, Player } from "./battleSpace.js";

// Create battlefields for each player
const player1Config = {
    width: 10,
    height: 10,
    ships: [
        { size: 4, x: 1, y: 2, orientation: 'horizontal' },
        { size: 3, x: 5, y: 5, orientation: 'vertical' }
    ]
};

const computerConfig = {
    width: 10,
    height: 10,
    ships: [
        { size: 4, x: 2, y: 3, orientation: 'horizontal' },
        { size: 3, x: 6, y: 6, orientation: 'vertical' }
    ]
};

// Instantiate players
const player = new Player("Player", false, player1Config);
const computer = new Player("Computer", true, computerConfig);

console.log(player.fireAt(computer, 2, 3)); 

console.log(computer.autoFire(player)); 