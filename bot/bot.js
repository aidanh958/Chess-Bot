function prep() {
    // required func

}

function think(board, remainingTime) {
    // required func
    
    // basic example: get random legal move
    let legalMoves = helper.getAllLegalMoves(board, color);
    let t = Math.floor(Math.random()*legalMoves.length);
    return legalMoves[t][1];
}

