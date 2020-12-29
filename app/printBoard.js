const printBoard = (board) => {
    for (let row = 0; row < board.length; ++row) {
        console.log('---------------------');

        let rowStr = '| ';

        for (let col = 0; col < board.length; ++col) {
            const delimeter = board[row][col] > 9 ? ' | ' : '  | ';

            rowStr += board[row][col] === null ? ' ' : board[row][col];
            rowStr += delimeter;
        }

        console.log(rowStr);
    }
    
    console.log('---------------------\n');
}

export default printBoard;