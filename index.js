import readline from 'readline';
import PuzzleBoard from './app/PuzzleBoard.js';
import printBoard from './app/printBoard.js';
import config from './app/config.js';
import {DIRECTIONS, BOARD_STATUSES} from './app/constants.js';

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

console.log('Welcome!\nPlease use arrows to navigate.\nGood luck!\n\n');

const puzzle = new PuzzleBoard({
    size: config.boardSize,

    onCreate: (board) => {
        printBoard(board);
    },
    
    onUpdate: (board, status) => {
        printBoard(board);

        if (status === BOARD_STATUSES.finished) {
            console.log('Congratulations! Well done :)');
            process.exit();
        }
    }
});

process.stdin.on('keypress', function(s, key) {
    if (key.name in DIRECTIONS) {
        console.log(`Moving ${key.name}... \n`);
        puzzle.makeMove(key.name);
    }
    if (key.name === 'c' && key.ctrl) {
        console.log('Thanks for playing. Buy :)');
        process.exit();
    }
});
  