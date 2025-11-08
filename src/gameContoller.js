import { Ship, Battlefield, Player } from "./battleSpace.js";
import { HUMAN_SHIP_LAYOUT, COMPUTER_SHIP_LAYOUT } from './config.js';


export class GameController{
    constructor(){
        this.humanPlayer = null;
        this.computerPlayer = null;
        this.currentPlayer = null; 
        this.gameStatus = 'initializing';
        this.initializeGame();  
    }
}