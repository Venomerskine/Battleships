import { GameController } from "../src/gameController.js";
import { PlacementController } from '../src/PlacementController.js';
import {COMPUTER_SHIP_LAYOUT} from '../src/config.js'


const BOARD_SIZE = 10;
const game = new GameController();

const placement = new PlacementController(game, 'hmnSpc');
placement.enable()


function createDivs(n, parentId) {
  const container = document.getElementById(parentId);

  for (let i = 0; i < n; i++) {
    const div = document.createElement('div');
    const x = i % BOARD_SIZE;
    const y = Math.floor(i / BOARD_SIZE);
    div.dataset.x = x;
    div.dataset.y = y;
    container.appendChild(div);
  }
}

createDivs(BOARD_SIZE * BOARD_SIZE, 'hmnSpc');
createDivs(BOARD_SIZE * BOARD_SIZE, 'cmpSpc');



function updateCell(cell, status) {
  cell.classList.remove('ship', 'hit', 'miss', 'sunk'); 

  if (status === 'ship') cell.classList.add('ship');
  else if (status === 'hit') cell.classList.add('hit');
  else if (status === 'sunk') cell.classList.add('sunk');
  else if (status === 'miss') cell.classList.add('miss');
}


function updateBoards() {
  const humanCells = document.querySelectorAll('#hmnSpc div');
  const humanBattlefield = game.humanPlayer.battlefield;

  humanCells.forEach(cell => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const status = humanBattlefield.getCellStatus(x, y);

    if (status === 'ship' || status === 'hit' || status === 'sunk' || status === 'miss') {
      updateCell(cell, status);
    }
  });

  const computerCells = document.querySelectorAll('#cmpSpc div');
  const computerBattlefield = game.computerPlayer.battlefield;

  computerCells.forEach(cell => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const status = computerBattlefield.getCellStatus(x, y);

    if (status === 'hit' || status === 'sunk' || status === 'miss') {
      updateCell(cell, status);
    }
  });
}



function handleTurnCallback() {
  updateBoards(); 

  if (game.gameStatus === 'finished') {
    document.getElementById('cmpSpc').style.pointerEvents = 'none';
    alert(`${game.currentPlayer.name} WINS!`);
    return;
  }

  if (game.currentPlayer.isComputer) {
    document.getElementById('cmpSpc').style.pointerEvents = 'none'; 
    setTimeout(() => {
      game.handleTurn(null, null, handleTurnCallback); 
    }, 2000);

  } else {
    document.getElementById('cmpSpc').style.pointerEvents = 'auto'; 
  }
}


updateBoards();

document.getElementById('cmpSpc').addEventListener('click', (e) => {
  if (e.target.matches('div') && game.currentPlayer.name === 'Human') {
    const x = parseInt(e.target.dataset.x, 10);
    const y = parseInt(e.target.dataset.y, 10);
    
    const key = `${x},${y}`;
    if (game.humanPlayer.previousShots.has(key)) {
        console.log("Already fired there.");
        return; 
    }

    document.getElementById('cmpSpc').style.pointerEvents = 'none';
    game.handleTurn(x, y, handleTurnCallback); 
  }
});

document.getElementById("startGame").addEventListener("click", () => {
    const humanLayout = placement.getHumanLayout(); 

    if (!humanLayout || humanLayout.length === 0) {
        alert("Place all ships first!");
        return;
    }
    const computerLayout = COMPUTER_SHIP_LAYOUT;  
  
    game.startGame(humanLayout, computerLayout);

    updateBoards();
});


document.getElementById('reset').addEventListener('click', () => location.reload());
function setStatus(message) {
  document.getElementById('status').textContent = message;
}
