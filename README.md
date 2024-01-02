# Chess-Bot
## how to run?
in terminal run
```
sudo git clone https://github.com/aidanh958/Chess-Bot.git
node host.js
```
then open `localhost:8080/index.html`

## how to setup bot?
inside `settings.json` you can edit the mode
```
mode 0: human vs bot
mode 1: bot vs bot
```
you can set the different bots files to be whatever and it will run that file

## how to make bot?
inside the bots file you will have a prep function and a think function (both are required to exist).
```
function prep() {}
function think(board, remainingTime) {}
```
the prep function will be called before the game starts so you can do preprocessing and stuff
the think function will be called when its the bots turn to make a move.
the think function must return a move in the format
```
return [ fromIndex, toIndex ]
```
the board is defined as a 1-dimensional array with 64 elements.
empty squares are defined as 1.
squares with pieces in them are defined as
```
{ type, color, etc... }
```
the colors are defined as:
```
white: 1,
black: 0
```

## API
### helper.getPiece(board, x, y)
the helper.getPiece function takes in a board, x, and y position and will return the piece.
### helper.getAllLegalMoves( board, color )
the helper.getAllLegalMoves function can be used to get all possible moves of the color.
it returns an array of possible moves with the same format as the return
### helper.getLegalMoves( board, pieceIndex )
the helper.getLegalMoves function is used to get the moves that one piece on the board
you need to pass in the board and index of the piece your interested in.
the functions return format:
```
[
  {
    board,
    [ from, to ]
  },
  ...
]
```
### helper.getColoredPieces(board, color)
the helper.getColoredPieces function will return all the indexes of the pieces with the specified color.
### helper.isInCheck(board, color)
the helper.isInCheck function will return true if the supplied boards king is in check



