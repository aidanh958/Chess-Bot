let c = document.getElementById("c");
let ctx = c.getContext("2d");

c.width = c.height = 500;

let botA, botB;
let times = [5000, 5000];
let sTime = [Date.now(), Date.now()];
let mode = 0;

let botNames = ["", ""];
let botUrl = ["", ""];

async function setupEverything() {
    let settingsBuf = await fetch("./settings.json");
    let settings = await settingsBuf.json();

    mode = settings.mode;
    botNames[0] = settings.botA.name;
    botNames[1] = settings.botB.name;
    botUrl[0] = settings.botA.file;
    botUrl[1] = settings.botB.file;
    times = [settings.times, settings.times];

    document.getElementById("tName").innerText = botNames[0];
    document.getElementById("bName").innerText = ( mode==1 )?botNames[1]:"human";
    document.getElementById("tTime").innerText = settings.times;
    document.getElementById("bTime").innerText = settings.times;

    if (mode == 1) {
        print("bot vs bot");
    } else {
        print("human vs bot");
    }

    start();
}

setTimeout(setupEverything, 100);



let outputText = document.getElementById("outputText");

function print(text) {
    outputText.innerText = text;
}

function start() {
    if (mode == 1) {
        botA = new Worker("./botHandler.js");
        botB = new Worker("./botHandler.js");

        botA.onmessage = function(e) {
            let res = movePiece(e.data[0], e.data[1]);
            if (!res) {
                print("Bot A was discalified due to illegal move");
                // lose
                return;
            }
            // legally moved
            times[0] -= Date.now()-sTime[0];
            if (times[0] <= 0) {
                print("Bot A lost due to time");
                // lose
                
                return;
            }
            document.getElementById("tTime").innerText = times[0];
            document.getElementById("bTime").innerText = times[1];

            if (mode == 1) {
                makeMoveB()
            }
        }
        botB.onmessage = function(e) {
            let res = movePiece(e.data[0], e.data[1]);
            if (!res) {
                print("Bot B was discalified due to illegal move");
                // lose
                return;
            }
            // legally moved
            times[1] -= Date.now()-sTime[1];
            if (times[1] <= 0) {
                print("Bot B lost due to time");
                // lose
                
                return;
            }
            document.getElementById("tTime").innerText = times[0];
            document.getElementById("bTime").innerText = times[1];

            if (mode == 1) {
                makeMoveA();
            }

        }
    } else if (mode == 0) {
        botA = new Worker("./botHandler.js");

        botA.onmessage = function(e) {
            let res = movePiece(e.data[0], e.data[1]);
            if (!res) {
                print("Bot was discalified due to illegal move");
                // lose
                return;
            }
            // legally moved
        }
    }


    startMatch();
}

async function startMatch() {
    if (mode == 0) {
        botA.postMessage({
            time: 5000, 
            color: 0, 
            board: currentBoard,
            code: botUrl[0]
        });
    } else if (mode == 1) {
        botA.postMessage({
            time: 5000,
            color: 0,
            board: currentBoard,
            code: botUrl[0]
        });
        botB.postMessage({
            time: 5000,
            color: 1,
            board: currentBoard,
            code: botUrl[1]
        });

        makeMoveB();
    }

    draw();
}

function makeMoveA() {
    let gameState = UpdateGameState();
    sTime[0] = Date.now();
    if (gameState !== false) {
        botA.postMessage({board: currentBoard, time: 5000});
    }
}
function makeMoveB() {
    let gameState = UpdateGameState();
    sTime[1] = Date.now();
    if (gameState !== false) {
        botB.postMessage({board: currentBoard, time: 5000});
    }
}

function fromFen(fen) {
    let board = [];
    let index = 0;
    while (index < fen.length) {
        if (fen[index] === "/") {
            index++;
            continue;
        }
        if (String(parseInt(fen[index])) === fen[index]) {
            for (let i = 0; i < parseInt(fen[index]); i++) {
                board.push(0);
            }
            index++;
            continue;
        } else {
            board.push({
                type: fen[index], 
                color: ( fen[index].toUpperCase()===fen[index] )?1:0,
                hasMoved: false
            });
            index++;
            continue;
        }
    }
    return board;
}
function toFen(board) {
    let fen = "";
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[(y*8)+x] !== 0) {
                fen += board[(y*8)+x].type;
            } else {
                fen += "0";
            }
        }
        fen += "/";
    }

    let i = 0;
    let fenOut = "";
    while (i < fen.length) {
        if (fen[i] === "0") {
            let total = 1;
            i++;
            while (fen[i] === "0") {
                total++;
                i++;
            }
            fenOut += total;
        } else {
            fenOut += fen[i];
            i++;
        }
    }
    return fenOut;
}

let currentBoard = fromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
let currentTurn = 1;

let images = { // piece representation : alias
    p: "bp",
    P: "wp",
    r: "br",
    R: "wr",
    n: "bn",
    N: "wn",
    b: "bb",
    B: "wb",
    q: "bq",
    Q: "wq",
    k: "bk",
    K: "wk"
};

for (let i in images) { // auto load images
    let img = document.createElement("img");
    img.src = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/" + images[i] + ".png";
    images[i] = img;
    document.body.append(img);
}

let mouse = {
    start: 0,
    now: [0, 0],
    down: false
};

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    for (let i = 0; i < 64; i++) {
        ctx.fillStyle = (i+Math.floor(i/8))%2>0?"white":"black";
        ctx.fillRect(i%8*500/8, Math.floor(i/8)*500/8, 500/8, 500/8);
   
        ctx.fillStyle = "grey";
        if (currentBoard[i] !== 0) {
            if (mouse.start == i && mouse.down) {
                continue; // dont draw piece if were moving it
            }
            ctx.drawImage(images[currentBoard[i].type], i%8*500/8, Math.floor(i/8)*500/8, 500/8, 500/8);
        }
    }

    if (mouse.down) {
        ctx.drawImage(images[currentBoard[mouse.start].type], mouse.now[0]-(500/16), mouse.now[1]-(500/16), 500/8, 500/8);
    }


    requestAnimationFrame(draw);
}

window.onmousedown = function(e) {
    let x = e.clientX-(window.innerWidth/2);
    let y = e.clientY-(window.innerHeight/2-250);

    let index = (Math.floor(y/(500/8))*8)+Math.floor(x/(500/8))
    if (currentBoard[index] !== 0 && currentBoard[index].color == currentTurn) {
        mouse.down = true;
        mouse.start = index;
    } else {
        mouse.down = false;
        mouse.start = 0;
    }
}
window.onmousemove = function(e) {
    let x = e.clientX-(window.innerWidth/2);
    let y = e.clientY-(window.innerHeight/2-250);

    mouse.now = [x, y];
}
window.onmouseup = function(e) {
    if (!mouse.down) {
        return;
    }

    let x = e.clientX-(window.innerWidth/2);
    let y = e.clientY-(window.innerHeight/2-250);

    let index = (Math.floor(y/(500/8))*8)+Math.floor(x/(500/8))
    if (index == mouse.start) {
        mouse.down = false;
        mouse.start = 0;
        return;
    }


    let res = movePiece(mouse.start, index);
    if (!res) {
    } else {
        makeMoveA();
        mouse.down = false;
    }
}


function movePiece(from, to) {
    let legalMoves = getLegalMoves(currentBoard, from);
    let prevBoard = [...currentBoard];
    mouse.down = false;
    let found = false;
    for (let i in legalMoves) {
        if (legalMoves[i] == to) {
            currentBoard[to] = currentBoard[from];
            currentBoard[from] = 0;
   
            currentBoard[to].hasMoved = true;

            currentTurn = (currentTurn==0)?1:0;
            found = true;
            break;
        }
    }

    if (!found && !isChecked(currentBoard, currentBoard[from].color) && currentBoard[from].type.toLowerCase() === "k") {
        if (
            !currentBoard[from].hasMoved && 
            !currentBoard[Math.floor(from/8)*8+8-1].hasMoved && 
            to == Math.floor(from/8)*8+8-1
        ) {
            let rr = Math.floor(from/8)*8+8-1;
            let hit = false;
            for (let i = from+1; i < rr; i++) {
                if (currentBoard[i] !== 0) {
                    hit = true;
                    break;
                }
            }
            if (!hit) {
                currentBoard[ Math.floor(from/8)*8+8-2 ] = currentBoard[from];
                currentBoard[ Math.floor(from/8)*8+8-3 ] = currentBoard[rr];
                currentBoard[ Math.floor(from/8)*8+8-1 ] = 0;
                currentBoard[from] = 0;

                currentBoard[to].hasMoved = true;

                currentTurn = (currentTurn==0)?1:0;
                found = true;
            }
        }
        if (!currentBoard[from].hasMoved && !currentBoard[Math.floor(from/8)*8].hasMoved && to == Math.floor(from/8)*8) {
            let rl = Math.floor(from/8)*8;
            let hit = false;
            for (let i = from-1; i > rl; i--) {
                if (currentBoard[i] !== 0) {
                    hit = true;
                    break;
                }
            }

            if (!hit) {
                currentBoard[ Math.floor(from/8)*8+1 ] = currentBoard[from];
                currentBoard[ Math.floor(from/8)*8+2 ] = currentBoard[rl];
                currentBoard[ Math.floor(from/8)*8 ] = 0;
                currentBoard[from] = 0;

                currentBoard[to].hasMoved = true;
                
                currentTurn = (currentTurn==0)?1:0;
                found = true;
            }
        }
    }

    let check = isChecked( currentBoard, (currentTurn==0)?1:0 );
    if (check) {
        currentBoard = prevBoard;
        currentTurn = (currentTurn==0)?1:0;
        return false;
    }
    return found;
}


function promotePawns() {
    for (let i = 0; i < 8; i++) {
        if (currentBoard[i] !== 0 && currentBoard[i].type === "P") {
            currentBoard[i].type = "Q";
        }
    }

    for (let i = 7*8; i < 8*8; i++) {
        if (currentBoard[i] !== 0 && currentBoard[i].type === "p") {
            currentBoard[i].type = "q";
        }
    }
}

function UpdateGameState() {
    promotePawns();
    let whiteKing = undefined;
    let blackKing = undefined;
    let pieces = {
        r: 0,
        n: 0,
        b: 0,
        q: 0,
        p: 0
    };
    for (let i in currentBoard) {
        if (currentBoard[i] !== 0 && currentBoard[i].type === "k") {
            blackKing = parseInt(i);
            continue;
        }
        if (currentBoard[i] !== 0 && currentBoard[i].type === "K") {
            whiteKing = parseInt(i);
            continue;
        }

        if (currentBoard[i] !== 0) {
            pieces[currentBoard[i].type.toLowerCase()]++;
        }
    }

    let sum = pieces.r+Math.max(0, pieces.n-1)+Math.max(0, pieces.b-1)+pieces.q+pieces.p;
    if (sum <= 0) {
        print("draw");
        return false;
    }


    let wMoves = getLegalMoves( currentBoard, whiteKing );
    let bMoves = getLegalMoves( currentBoard, blackKing );

    if (isChecked(currentBoard, 0) && isChecked(currentBoard, 1)) {
        // black
        let blackMoves = helper.getAllLegalMoves(currentBoard, 0);
        let whiteMoves = helper.getAllLegalMoves(currentBoard, 1);

        let blackSurvive = blackMoves>0;
        let whiteSurvive = whiteMoves>0;

        if (!blackSurvive && !whiteSurvive) {
            print("draw");
            return false;
        } else if (blackSurvive && whiteSurvive) {
            return true;
        } else if (blackSurvive) {
            print("black won by checkmate");
            return false;
        } else if (whiteSurvive) {
            print("white won by checkmate");
            return false;
        }
    }else if (!isChecked(currentBoard, 0) && !isChecked(currentBoard, 1)) {
        return checkForDraw();
    } else if (isChecked(currentBoard, 0)) {
        // black
        let m = helper.getAllLegalMoves(currentBoard, 0);

        if (m.length > 0) {
            return true;
        }

        print("white won by checkmate");
        return false;
    } else if (isChecked(currentBoard, 1)) {
        // white
        let m = helper.getAllLegalMoves(currentBoard, 1);

        if (m.length > 0) {
            return true;
        }
        print("black won by checkmate");
        return false;
    }

    return false;
}

function checkForDraw() {
    let wMoves = helper.getAllLegalMoves(currentBoard, 1);
    let bMoves = helper.getAllLegalMoves(currentBoard, 0);

    if (wMoves.length == 0 || bMoves.length == 0) {
        print("stalemate");
        return false;
    }
    return true;
}
























