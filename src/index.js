// Not in use.

// import { GameController } from './gameController.js';
// import readline from 'readline';

//  const game = new GameController();

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// function humanTurn() {
//   if (game.gameStatus !== 'playing') {
//     rl.close();
//     return;
//   }
  
//   rl.question(`Enter coordinates for ${game.currentPlayer.name} (format: x,y): `, (input) => {
//     const [x, y] = input.split(',').map(Number);

//     game.handleTurn(x, y, humanTurn); 
//   });
// }

// if (game.currentPlayer.isComputer) {

//   game.handleTurn(null, null, humanTurn); 
// } else {
//   humanTurn();
// }