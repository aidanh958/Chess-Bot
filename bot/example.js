let pieceValues = { // assign each piece a point value
    p: -1,
    n: -3,
    b: -3.5,
    r: 5,
    q: 8,
    k: 10
}


function prep() {
    // required func

}

function think(board, remainingTime) {
    // required func
    let best = { // keep track of best possible move and score for that move
        move: null,
        eval: -Infinity
    };

    let legalMoves = helper.getAllLegalMoves( board, color ); // get all legal moves
    for (let i in legalMoves) { // loop through all legal moves
        let score = evaluate(legalMoves[i][0])+(Math.random()*2-1)*0.1; // run evaluate function on new board after that move would be made (add some randomness to it)
        if (score > best.eval) { // keep it if its the best move
            best.eval = score;
            best.move = legalMoves[i][1];
        }
    }

    return best.move; // return the best move found
}


function evaluate(board) { // add up the values of all pieces on the board
    let score = 0;
    for (let i in board) {
        if (board[i] == 0) continue;

        score += pieceValues[ board[i].type.toLowerCase() ] * (board[i].color==color)?1:-1; // add piece value then multiply it by negative one if its the opponents piece
    }

    return score;
}
