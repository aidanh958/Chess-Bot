function prep() {
    // required func

}

function think(currentBoard, remainingTime) {
    // required func
    
    // basic example: get random legal move
    let legalMoves = helper.getAllLegalMoves(currentBoard, color);
    let t = Math.floor(Math.random()*legalMoves.length);
    return legalMoves[t][1];
}

