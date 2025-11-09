import { Ship, Battlefield, Player } from "./battleSpace.js";
import { HUMAN_SHIP_LAYOUT, COMPUTER_SHIP_LAYOUT, BOARD_WIDTH, BOARD_HEIGHT} from './config.js';


export class GameController{
    constructor(){
        this.humanPlayer = null;
        this.computerPlayer = null;
        this.currentPlayer = null; 
        this.gameStatus = 'initializing';
        this.initializeGame();  
    }

    initializeGame() {
        console.log("Initializing game...");

        // 1. Define battlefield configuration
        const commonConfig = {
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT
        };

        // 2. Create the Human Player
        const humanConfig = { ...commonConfig, ships: HUMAN_SHIP_LAYOUT };
        this.humanPlayer = new Player("Human", false, humanConfig);
        console.log("Human Player created with battlefield.");

        // 3. Create the Computer Player
        const computerConfig = { ...commonConfig, ships: COMPUTER_SHIP_LAYOUT };
        this.computerPlayer = new Player("Computer", true, computerConfig);
        console.log("Computer Player created with battlefield.");

        // 4. Set initial turn
        this.currentPlayer = this.humanPlayer; // Human typically goes first
        this.gameStatus = 'playing';
        console.log(`Game started. It is the ${this.currentPlayer.name}'s turn.`);

        this.renderInitialBoards();
    }

renderInitialBoards() {
        console.log(`Human's Board (Own Ships):`);
        console.log(this.getBoardVisualization(this.humanPlayer.battlefield, true));

        console.log(`\nComputer's Board (Where Human will fire):`);
        console.log(this.getBoardVisualization(this.computerPlayer.battlefield, false));
    }


    getBoardVisualization(battlefield, showShips = false) {
        let boardString = '';
        for (let y = 0; y < battlefield.height; y++) {
            for (let x = 0; x < battlefield.width; x++) {
                let cell = 'O'; 

                const status = battlefield.getCellStatus(x, y);

                if (showShips && status === 'ship') {
                    cell = 'S'; 
                }
         
                if (battlefield.attacks.has(`${x},${y}`)) {
                    if (status === 'hit') {
                        cell = 'X'; 
                    } else if (status === 'sunk') {
                        cell = '#';
                    } else if (status === 'miss') {
                        cell = 'M'; 
                    } 

                }

                boardString += cell + ' ';
            }
            boardString += '\n';
        }
        return boardString;
    }
    handleTurn(x = null, y = null){
        if (this.gameStatus != 'playing'){
            console.log(`Game is ${this.gameStatus}. Cannot take turn`);
        return
        }

        const attacker = this.currentPlayer
        const defender = attacker === this.humanPlayer ? this.computerPlayer : this.humanPlayer;
        let result

        if (attacker.isComputer){
            result = attacker.autoFire(defender)

            x = result.x; 
            y = result.y;
        } else{
            if (x === null || y === null) {
                console.error("Human turn requires (x, y) coordinates.");
                return
            }
            result = attacker.fireAt(defender, x, y)
        }

        console.log(`${result.attacker} fires at (${x}, ${y}): ${result.message}`);
        this.renderBoards()

        if(defender.hasLost()){
            this.gameStatus = 'finished';
            console.log(`*** ${attacker.name} wins the game! ***`)
            callback();
            return
        }

        this.currentPlayer = defender;
        console.log(`\n--- Turn switch. It is now the ${this.currentPlayer.name}'s turn ---`)

        if (this.currentPlayer.isComputer) {
            setTimeout(() => {
                this.handleTurn(null, null, callback); 
            }, 500);
        } else {
            callback();
        }
    }

renderBoards() {
        console.log(`\n--- Boards Update ---`);
        console.log(`Human's Board (Own Ships):`);
        console.log(this.getBoardVisualization(this.humanPlayer.battlefield, true));

        console.log(`\nComputer's Board (Target Board):`);
        console.log(this.getBoardVisualization(this.computerPlayer.battlefield, false));
    }

} 

