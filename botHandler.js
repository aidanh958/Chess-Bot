importScripts("./legalMoveGenerator.js")
importScripts("./botHelper.js");

let setup = false;
let time = 5000;
let color = 0;
let code = "";
let func = null;

onmessage = (e) => {
    if (!setup) {
        time = e.data.time;
        color = e.data.color;
        code = e.data.code;

        importScripts(code);

        prep();
        setup = true;
    } else {
        time = e.data.time;
        
        postMessage(think(e.data.board, time));
    }
}





