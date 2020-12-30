import {DIRECTIONS, BOARD_STATUSES} from './constants.js';

/**
 * @typedef {Object} BoardState
 * @property {String} status Board status: "finished" or "inProgress"
 * @property {Array} values Board values
 */

 /**
 * @typedef {Object} BoardConfig
 * @property {Number} size Board size
 */

export default class PuzzleBoard {
    /**
     * @param {BoardConfig} config
     */
    constructor(config) {
        this.__validateConfig(config);

        this.size = config.size;
        this.board = new Array(this.size);
        this.tiles = new Array(this.size**2 - 1);
        this.emptySpot = {row: null, col: null};
        this.inPlaceTilesCounter = 0;
    }

    /**
     * Create puzzle board.
     * @return {BoardState}
     */
    create() {
        this.__createTiles();
        this.__shuffleTiles();
        this.__pickEmptySpot();
        this.__ensureSolvability();
        this.__fillBoard();
        this.__updateInPlaceCounter();

        return this.__getBoardState();
    }

    /**
     * Move a tile to provided direction
     * @param {String} direction 
     * @return {BoardState}
     */
    makeMove(direction) {
        const {left, right, up, down} = DIRECTIONS;

        switch (direction) {
            case up:
                this.__moveUp();
                break;
            case down: 
                this.__moveDown();
                break;
            case left:
                this.__moveLeft();
                break;
            case right:
                this.__moveRight();
                break;
            default:
                throw new Error(`Direction is not valid. Allowed values are: ${up}, ${down}, ${right}, ${left}`);
        }

        this.__updateInPlaceCounter();

        return this.__getBoardState();
    }

    __getBoardState() {
        let status = BOARD_STATUSES.inProgress;

        if (this.inPlaceTilesCounter === this.size**2 - 1) {
            status = BOARD_STATUSES.finished;
        }

        return {
            status,
            values: this.board
        };
    }

    __moveUp() {
        const {row, col} = this.emptySpot;

        if (row === this.size - 1) return;
            
        this.board[row][col] = this.board[row + 1][col];
        this.board[row + 1][col] = null;
        this.emptySpot.row += 1;
    }

    __moveDown() {
        const {row, col} = this.emptySpot;

        if (row === 0) return;

        this.board[row][col] = this.board[row - 1][col];
        this.board[row - 1][col] = null;
        this.emptySpot.row -= 1;
    }

    __moveLeft() {
        const {row, col} = this.emptySpot;

        if (col === this.size - 1) return;

        this.board[row][col] = this.board[row][col + 1];
        this.board[row][col + 1] = null;
        this.emptySpot.col += 1;
    }

    __moveRight() {
        const {row, col} = this.emptySpot;

        if (col === 0) return;

        this.board[row][col] = this.board[row][col - 1];
        this.board[row][col - 1] = null;
        this.emptySpot.col -= 1;
    }

    __updateInPlaceCounter() {
        let counter = 0;

        for (let row = 0; row < this.size; ++row) {
            for (let col = 0; col < this.size; ++col) {
                const isTileInPlace = this.board[row][col] === row * this.size + col + 1;

                if (isTileInPlace) {
                    ++counter;
                }
            }
        }

        this.inPlaceTilesCounter = counter;
    }

    __createTiles() {
        for (let i = 0; i < this.tiles.length; ++i) {
            this.tiles[i] = i + 1;
        }
    }

    __shuffleTiles() {
        for (let i = 0; i < this.tiles.length; ++i) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[randomIndex]] = [this.tiles[randomIndex], this.tiles[i]];
        }
    }
    
    __pickEmptySpot() {
        this.emptySpot.row = Math.floor(Math.random() * this.size);
        this.emptySpot.col = Math.floor(Math.random() * this.size);
    }

    /**
     * Check if the board is solvable, if it's not - shuffle and check again.
     * Math is provided by the article https://ru.wikipedia.org/wiki/Игра_в_15#Математическое_описание
     */
    __ensureSolvability() {
        const inversions = this.__getInversionsCount();
        const isSolvable = (inversions + this.emptySpot.row + 1) % 2 === 0;

        if (!isSolvable) {
            this.__shuffleTiles();
            this.__pickEmptySpot();
            this.__ensureSolvability();
        }
    }

    __getInversionsCount() {
        let counter = 0;

        for (let i = 0; i < this.tiles.length; ++i) {
            for (let j = i + 1; j < this.tiles.length; ++j) {
                if (this.tiles[j] < this.tiles[i]) {
                    ++counter;
                }
            }
        }

        return counter;
    }

    __fillBoard() {
        for (let row = 0; row < this.size; ++row) {
            this.board[row] = new Array(this.size);

            for (let col = 0; col < this.size; ++col) {
                if (row === this.emptySpot.row && col === this.emptySpot.col) {
                    this.board[row][col] = null;
                    continue;
                }

                this.board[row][col] = this.tiles.shift();
            }
        }
    }

    __validateConfig(config) {
        if (!config) {
            throw new Error('Config is required.')
        }
        if (!Number.isInteger(config.size)) {
            throw new Error('Board size should be a number.');
        }
    }
}