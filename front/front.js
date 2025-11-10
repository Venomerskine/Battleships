import { GameController } from "../src/gameController.js";
const game = new GameController();

function createDivs(n, parentId) {
  const container = document.getElementById(parentId);

  for (let i = 0; i < n; i++) {
    const div = document.createElement('div');
    const x = i % 10;
    const y = Math.floor(i / 10);
    div.dataset.x = x;
    div.dataset.y = y;
    div.textContent = ''; 
    container.appendChild(div);
  }
}


createDivs(100, 'hmnSpc')
createDivs(100, 'cmpSpc')

document.getElementById('cmpSpc').addEventListener('click', (e) => {
  if (e.target.matches('div')) {
    const x = parseInt(e.target.dataset.x, 10);
    const y = parseInt(e.target.dataset.y, 10);

    game.handleTurn(x, y);
  }
});


function updateBoards() {
  const computerCells = document.querySelectorAll('#cmpSpc div');
  const battlefield = game.computerPlayer.battlefield;

  computerCells.forEach(cell => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const status = battlefield.getCellStatus(x, y);
    if (status === 'hit') cell.classList.add('hit');
    else if (status === 'miss') cell.classList.add('miss');
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
    }, 500);

  } else {
    document.getElementById('cmpSpc').style.pointerEvents = 'auto'; 
  }
}