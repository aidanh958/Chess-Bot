function getLegalMoves(board, index) {
    if (board[index] == 0) {
        return [];
    }

    let movs = [];
    if (board[index].type === "P") {
        if (board[index-8] == 0) {
            movs.push(index-8);
            if (board[index-16] == 0 && !board[index].hasMoved) {
                movs.push(index-16);
            }
        }
        if (index%8>0 && board[index-8-1] !== 0 && board[index-8-1] !== undefined && board[index-8-1].color !== board[index].color) {
            movs.push(index-8-1);
        }
        if (index%8<7 && board[index-8+1] !== 0 && board[index-8+1] !== undefined && board[index-8+1].color !== board[index].color) {
            movs.push(index-8+1);
        }
    } else if (board[index].type === "p") {
        if (board[index+8] == 0) {
            movs.push(index+8);
            if (board[index+16] == 0 && !board[index].hasMoved) {
                movs.push(index+16);
            }
        }
        if (index%8>0 && board[index+8-1] !== 0 && board[index+8-1] !== undefined && board[index+8-1].color !== board[index].color) {
            movs.push(index+8-1);
        }
        if (index%8<7 && board[index+8+1] !== 0 && board[index+8+1] !== undefined && board[index+8+1].color !== board[index].color) {
            movs.push(index+8+1);
        }
    } else if (board[index].type.toLowerCase() === "r") {
        movs = [...movs, ...handleRooks(board, index)];
    } else if (board[index].type.toLowerCase() === "n") {
        movs = [...movs, ...handleKnights(board, index)];
    } else if (board[index].type.toLowerCase() === "b") {
        movs = [...movs, ...handleBishops(board, index)];
    } else if (board[index].type.toLowerCase() === "q") {
        movs = [...movs, ...handleRooks(board, index), ...handleBishops(board, index)];
    } else if (board[index].type.toLowerCase() === "k") {
        movs = [...movs, ...handleKings(board, index)];
    } else {
        for (let i = 0; i < 64; i++) {
            movs.push(i);
        }
    }


    return movs;
}

function handleKings(board, index) {
    let movs = [];
    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            if (y == 0 && x == 0) continue;
            if (Math.floor(index/8)+y >= 8 || index%8+x >= 8 || Math.floor(index/8)+y < 0 || index%8+x < 0) continue;

            if (String(typeof board[index+(y*8)+x]) === "undefined") {
                continue;
            }

            if (board[index+(y*8)+x] == 0) {
                movs.push(index+(y*8)+x);
            } else if (board[index+(y*8)+x].color !== board[index].color) {
                movs.push(index+(y*8)+x);
            }
        }
    }

    return movs;
}

function handleBishops(board, index) {
    let movs = [];

    for (let i = 1; i < 8; i++) {
        if (index%8+i >= 8 || Math.floor(index/8)+i >= 8) {
            break;
        }
        if (board[index+i+(i*8)] !== 0 && board[index+i+(i*8)] !== undefined) {
            if (board[index+i+(i*8)].color !== board[index].color) {
                movs.push(index+i+(i*8));
            }
            break;
        }
        movs.push(index+i+(i*8));
    }
    for (let i = 1; i < 8; i++) {
        if (index%8-i < 0 || Math.floor(index/8)+i >= 8) {
            break;
        }
        if (board[index-i+(i*8)] !== 0 && board[index-i+(i*8)] !== undefined) {
            if (board[index-i+(i*8)].color !== board[index].color) {
                movs.push(index-i+(i*8));
            }
            break;
        }
        movs.push(index-i+(i*8));
    }

    for (let i = 1; i < 8; i++) {
        if (index%8+i > 8 || Math.floor(index/8)-i < 0) {
            break;
        }
        if (board[index+i-(i*8)] !== 0 && board[index+i-(i*8)] !== undefined) {
            if (board[index+i-(i*8)].color !== board[index].color) {
                movs.push(index+i-(i*8));
            }
            break;
        }
        movs.push(index+i-(i*8));
    }
    for (let i = 1; i < 8; i++) {
        if (index%8-i < 0 || Math.floor(index/8)-i < 0) {
            break;
        }
        if (board[index-i-(i*8)] !== 0 && board[index-i-(i*8)] !== undefined) {
            if (board[index-i-(i*8)].color !== board[index].color) {
                movs.push(index-i-(i*8));
            }
            break;
        }
        movs.push(index-i-(i*8));
    }

    return movs;
}


function handleKnights(board, index) {
    let movs = [];
    let x = index%8;
    let y = Math.floor(index/8);

    if (x-2 >= 0 && y-1 >= 0 && board[index-2-8] !== undefined && (board[index-2-8] == 0 || board[index-2-8].color !== board[index].color)) {
        movs.push(index-2-8);
    }
    if (x+2 < 8 && y-1 >= 0 && board[index+2-8] !== undefined && (board[index+2-8] == 0 || board[index+2-8].color !== board[index].color)) {
        movs.push(index+2-8);
    }
    if (x-2 >= 0 && y+1 < 8 && board[index-+-8] !== undefined && (board[index-2+8] == 0 || board[index-2+8].color !== board[index].color)) {
        movs.push(index-2+8);
    }
    if (x+2 < 8 && y+1 < 8 && board[index+2+8] !== undefined && (board[index+2+8] == 0 || board[index+2+8].color !== board[index].color)) {
        movs.push(index+2+8);
    }

    if (x-1 >= 0 && y-2 >= 0 && board[index-1-16] !== undefined && (board[index-1-16] == 0 || board[index-1-16].color !== board[index].color)) {
        movs.push(index-1-16);
    }
    if (x+1 < 8 && y-2 >= 0 && board[index+1-16] !== undefined && (board[index+1-16] == 0 || board[index+1-16].color !== board[index].color)) {
        movs.push(index+1-16);
    }
    if (x-1 >= 0 && y+2 < 8 && board[index-1+16] !== undefined && (board[index-1+16] == 0 || board[index-1+16].color !== board[index].color)) {
        movs.push(index-1+16);
    }
    if (x+1 <= 8 && y+2 < 8 && board[index+1+16] !== undefined && (board[index+1+16] == 0 || board[index+1+16].color !== board[index].color)) {
        movs.push(index+1+16);
    }

    return movs;
}







function handleRooks(board, index) {
    let movs = [];
    for (let y = Math.floor(index/8)+1; y < 8; y++) {
        if (board[index%8+(y*8)] !== 0) {
            if (board[index%8+(y*8)].color !== board[index].color) {
                movs.push(index%8+(y*8));
            }
            break;
        }
        movs.push(index%8+(y*8));
    }
    for (let y = Math.floor(index/8)-1; y >= 0; y--) {
        if (board[index%8+(y*8)] !== 0) {
            if (board[index%8+(y*8)].color !== board[index].color) {
                movs.push(index%8+(y*8));
            }
            break;
        }
        movs.push(index%8+(y*8));
    }
    for (let x = index%8+1; x < 8; x++) {
        if (board[Math.floor(index/8)*8+x] !== 0) {
            if (board[Math.floor(index/8)*8+x].color !== board[index].color) {
                movs.push(Math.floor(index/8)*8+x);
            }
            break;
        }
        movs.push(Math.floor(index/8)*8+x);
    } 
    for (let x = index%8-1; x >= 0; x--) {
        if (board[Math.floor(index/8)*8+x] !== 0) {
            if (board[Math.floor(index/8)*8+x].color !== board[index].color) {
                movs.push(Math.floor(index/8)*8+x);
            }
            break;
        }
        movs.push(Math.floor(index/8)*8+x);
    }
    return movs;
}
function isChecked(board, color) {
    let legalMoves = [];
    for (let i = 0; i < 64; i++) {
        if (board[i] !== 0 && board[i].color !== color) {
            let newMoves = getLegalMoves(board, i);
            legalMoves = [...legalMoves, ...newMoves];
        }
    }

    for (let move of legalMoves) {
        if (board[move] !== 0 && board[move].type.toLowerCase() == "k") {
            return true;
        }
    };
    return false;
}


