let helper = {
    convertIndexToPos: function(ind) {
        return [ ind%8, Math.floor(ind/8) ];
    },
    convertPosToIndex: function(x, y) {
        return (y*8)+x;
    },
    getPiece: function(board, x, y) {
        return board[(y*8)+x];
    },
    getColoredPieces: function(board, color) {
        let p = [];
        for (let i in board) {
            if (board[i] == 0) continue;
            if (board[i].color == color) {
                p.push(parseInt(i));
            }
        };
        return p;
    },
    getAllLegalMoves: function(board, color) {
        let b = this.getColoredPieces(board, color);
        let ans = [];
        for (let i in b) {
            let l = this.getLegalMoves(board, b[i]);
            for (let i in l) {
                l[i] = l[i][1];
            }
            for (let e in l) {
                ans.push( [this.makeMove(board, l[e]), l[e]] );
            }
        }
        let legal = [];
        for (let i in ans) {
            if (!isChecked(ans[i][0], color)) {
                legal.push(ans[i]);
            }
        }

        return legal;
    },
    makeMove: function(inBoard, move) {
        let board = [...inBoard];
        if (board[move[0]].type.toLowerCase() === "k") {
            if (Math.abs((move[1]%8)-(move[0]%8)) > 1) {
                let r = board[move[1]];
                board[move[1]] = 0;
                board[move[1]-1] = board[move[0]];
                board[move[0]] = 0;
                if (move[1] > move[0]) {
                    board[move[1]-2] = r;
                } else {
                    board[move[1]+2] = r;
                }
            }
        }
        board[move[1]] = board[move[0]];
        board[move[0]] = 0;

        return board;
    },
    getLegalMoves: function(board, index) {
        let lMoves = [];
        let plMoves = getLegalMoves(board, index);
        for (let i in plMoves) {
            plMoves[i] = [index, plMoves[i]];
        }

        if (!isChecked(board, board[index].color) && board[index].type.toLowerCase() === "k" && !board[index].hasMoved) {
            let lr = Math.floor(index/8)*8;
            if (board[lr] !== 0 && board[lr].type.toLowerCase() === "r" && !board[lr].hasMoved) {
                let hit = false;
                for (let i = index-1; i > lr; i--) {
                    if (board[i] !== 0) {
                        hit = true;
                        break;
                    }
                }
                if (!hit) {
                    plMoves.push([index, lr]);
                }
            }
            let rr = Math.floor(index/8)*8+7;
            if (board[rr] !== 0 && board[rr].type.toLowerCase() === "r" && !board[rr].hasMoved) {
                let hit = false;
                for (let i = index+1; i < rr; i++) {
                    if (board[i] !== 0) {
                        hit = true;
                        break;
                    }
                }
                if (!hit) {
                    plMoves.push([index, rr]);
                }
            }
        }

        for (let i = 0; i < plMoves.length; i++) {
            let nBoard = this.makeMove( board, plMoves[parseInt(i)] );
            if (!isChecked(nBoard, board[index].color)) {
                lMoves.push([nBoard, plMoves[i]]);
            }
        }

        return lMoves;
    },
    isInCheck: function(board, color) {
        return isChecked(board, color);
    
    }
}



