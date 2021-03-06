import PuzzleBoard from '../app/PuzzleBoard.js';
import {BOARD_STATUSES, DIRECTIONS} from '../app/constants.js';

describe('PuzzleBoard', () => {
    describe('instantiate', () => {
        test('should throw an error when confing is not provided', () => {
            expect(() => new PuzzleBoard()).toThrow();
        });

        test('should throw an error when size is not valid', () => {
            expect(() => new PuzzleBoard({size: 'some_str'})).toThrow();
        });
    });

    describe('#create', () => {
        const SIZE = 4
        const puzzle = new PuzzleBoard({size: SIZE});
        const board = puzzle.create();

        test('should create a puzzle board of provided size', () => {
            expect(board.values).toHaveLength(SIZE);
            expect(board.values[0]).toHaveLength(SIZE);
        });

        test('should fill the board with tiles and one empty spot', () => {
            const seen = new Set();
            const maxTile = SIZE**2 - 1;
            const {values} = board;
            let emptyCounter = 0;

            for (let i = 0; i < values.length; ++i) {
                for (let j = 0; j < values.length; ++j) {
                    const value = values[i][j];

                    if (value === null) {
                        ++emptyCounter;
                        continue;
                    }

                    expect(value).toBeLessThanOrEqual(maxTile);
                    expect(seen.has(value)).toBeFalsy();
                    seen.add(value);
                }
            }

            expect(emptyCounter).toBe(1);
        });

        test('should return valid status', () => {
            expect(Object.values(BOARD_STATUSES)).toContain(board.status);
        });
    });

    describe('#makeMove', () => {
        const SIZE = 4
        const puzzle = new PuzzleBoard({size: SIZE});

        puzzle.create();

        test('should move tile to the left', () => {
            puzzle.board = [
                [1,2,3,4],
                [5,6,null,7],
                [8,9,10,11],
                [12,13,14,15]
            ];
            puzzle.emptySpot = {row: 1, col: 2};

            const board = puzzle.makeMove(DIRECTIONS.left);

            expect(board.values[1][2]).toBe(7);
            expect(board.values[1][3]).toBe(null);
        });

        test('should do nothing when can not move tile to the left', () => {
            puzzle.board = [
                [1,2,3,4],
                [5,6,7,null],
                [8,9,10,11],
                [12,13,14,15]
            ];
            puzzle.emptySpot = {row: 1, col: 3};

            const board = puzzle.makeMove(DIRECTIONS.left);

            expect(board.values[1][2]).toBe(7);
            expect(board.values[1][3]).toBe(null);
        });

        test('should move tile to the right', () => {
            puzzle.board = [
                [1,2,3,4],
                [5,6,null,7],
                [8,9,10,11],
                [12,13,14,15]
            ];
            puzzle.emptySpot = {row: 1, col: 2};

            const board = puzzle.makeMove(DIRECTIONS.right);

            expect(board.values[1][2]).toBe(6);
            expect(board.values[1][1]).toBe(null);
        });

        test('should do nothing when can not move tile to the right', () => {
            puzzle.board = [
                [1,2,3,4],
                [null,5,6,7],
                [8,9,10,11],
                [12,13,14,15]
            ];
            puzzle.emptySpot = {row: 1, col: 0};

            const board = puzzle.makeMove(DIRECTIONS.right);

            expect(board.values[1][1]).toBe(5);
            expect(board.values[1][0]).toBe(null);
        });

        test('should move tile up', () => {
            puzzle.board = [
                [1,2,3,4],
                [5,6,null,7],
                [8,9,10,11],
                [12,13,14,15]
            ];
            puzzle.emptySpot = {row: 1, col: 2};

            const board = puzzle.makeMove(DIRECTIONS.up);

            expect(board.values[1][2]).toBe(10);
            expect(board.values[2][2]).toBe(null);
        });

        test('should do nothing when can not move tile up', () => {
            puzzle.board = [
                [1,2,3,4],
                [5,6,14,7],
                [8,9,10,11],
                [12,13,null,15]
            ];
            puzzle.emptySpot = {row: 3, col: 2};

            const board = puzzle.makeMove(DIRECTIONS.up);

            expect(board.values[2][2]).toBe(10);
            expect(board.values[3][2]).toBe(null);
        });

        test('should move tile down', () => {
            puzzle.board = [
                [1,2,3,4],
                [5,6,null,7],
                [8,9,10,11],
                [12,13,14,15]
            ];
            puzzle.emptySpot = {row: 1, col: 2};

            const board = puzzle.makeMove(DIRECTIONS.down);

            expect(board.values[1][2]).toBe(3);
            expect(board.values[0][2]).toBe(null);
        });

        test('should do nothing when can not move tile down', () => {
            puzzle.board = [
                [1,2,null,4],
                [5,6,3,7],
                [8,9,10,11],
                [12,13,14,15]
            ];
            puzzle.emptySpot = {row: 0, col: 2};

            const board = puzzle.makeMove(DIRECTIONS.down);

            expect(board.values[1][2]).toBe(3);
            expect(board.values[0][2]).toBe(null);
        });

        test('should return status "inProgress" when the game is not finished', () => {
            puzzle.board = [
                [1,2,3,4],
                [5,6,7,8],
                [9,10,11,12],
                [13,14,null,15]
            ];
            puzzle.emptySpot = {row: 3, col: 2};
            puzzle.inPlaceTilesCounter = 14;

            const board = puzzle.makeMove(DIRECTIONS.down);

            expect(board.status).toBe(BOARD_STATUSES.inProgress);
        });

        test('should return status "finished" when the game is over', () => {
            puzzle.board = [
                [1,2,3,4],
                [5,6,7,8],
                [9,10,11,12],
                [13,14,null,15]
            ];
            puzzle.emptySpot = {row: 3, col: 2};
            puzzle.inPlaceTilesCounter = 14;

            const board = puzzle.makeMove(DIRECTIONS.left);

            expect(board.status).toBe(BOARD_STATUSES.finished);
        });

        test('should throw an error when a direction is invalid', () => {
            expect(() => puzzle.makeMove('some_key')).toThrow();
        });
    });
});