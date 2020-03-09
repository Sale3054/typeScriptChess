//Helper Definitions
// -----------------------------------------------------
var BRD_SQ_NUM = 120;
var Pieces;
(function (Pieces) {
    Pieces[Pieces["EMPTY"] = 0] = "EMPTY";
    Pieces[Pieces["WHITE_PAWN"] = 1] = "WHITE_PAWN";
    Pieces[Pieces["WHITE_KNIGHT"] = 2] = "WHITE_KNIGHT";
    Pieces[Pieces["WHITE_BISHOP"] = 3] = "WHITE_BISHOP";
    Pieces[Pieces["WHITE_ROOK"] = 4] = "WHITE_ROOK";
    Pieces[Pieces["WHITE_QUEEN"] = 5] = "WHITE_QUEEN";
    Pieces[Pieces["WHITE_KING"] = 6] = "WHITE_KING";
    Pieces[Pieces["BLACK_PAWN"] = 7] = "BLACK_PAWN";
    Pieces[Pieces["BLACK_KNIGHT"] = 8] = "BLACK_KNIGHT";
    Pieces[Pieces["BLACK_BISHOP"] = 9] = "BLACK_BISHOP";
    Pieces[Pieces["BLACK_ROOK"] = 10] = "BLACK_ROOK";
    Pieces[Pieces["BLACK_QUEEN"] = 11] = "BLACK_QUEEN";
    Pieces[Pieces["BLACK_KING"] = 12] = "BLACK_KING";
})(Pieces || (Pieces = {}));
var Files;
(function (Files) {
    Files[Files["FILE_A"] = 0] = "FILE_A";
    Files[Files["FILE_B"] = 1] = "FILE_B";
    Files[Files["FILE_C"] = 2] = "FILE_C";
    Files[Files["FILE_D"] = 3] = "FILE_D";
    Files[Files["FILE_E"] = 4] = "FILE_E";
    Files[Files["FILE_F"] = 5] = "FILE_F";
    Files[Files["FILE_G"] = 6] = "FILE_G";
    Files[Files["FILE_H"] = 7] = "FILE_H";
    Files[Files["FILE_NONE"] = 8] = "FILE_NONE";
})(Files || (Files = {}));
var Ranks;
(function (Ranks) {
    Ranks[Ranks["RANK_1"] = 0] = "RANK_1";
    Ranks[Ranks["RANK_2"] = 1] = "RANK_2";
    Ranks[Ranks["RANK_3"] = 2] = "RANK_3";
    Ranks[Ranks["RANK_4"] = 3] = "RANK_4";
    Ranks[Ranks["RANK_5"] = 4] = "RANK_5";
    Ranks[Ranks["RANK_6"] = 5] = "RANK_6";
    Ranks[Ranks["RANK_7"] = 6] = "RANK_7";
    Ranks[Ranks["RANK_8"] = 7] = "RANK_8";
    Ranks[Ranks["RANK_NONE"] = 8] = "RANK_NONE";
})(Ranks || (Ranks = {}));
var Colors;
(function (Colors) {
    Colors[Colors["WHITE"] = 0] = "WHITE";
    Colors[Colors["BLACK"] = 1] = "BLACK";
    Colors[Colors["BOTH"] = 2] = "BOTH";
})(Colors || (Colors = {}));
var Squares;
(function (Squares) {
    Squares[Squares["A1"] = 21] = "A1";
    Squares[Squares["B1"] = 22] = "B1";
    Squares[Squares["C1"] = 23] = "C1";
    Squares[Squares["D1"] = 24] = "D1";
    Squares[Squares["E1"] = 25] = "E1";
    Squares[Squares["F1"] = 26] = "F1";
    Squares[Squares["G1"] = 27] = "G1";
    Squares[Squares["H1"] = 28] = "H1";
    Squares[Squares["A8"] = 91] = "A8";
    Squares[Squares["B8"] = 92] = "B8";
    Squares[Squares["C8"] = 93] = "C8";
    Squares[Squares["D8"] = 94] = "D8";
    Squares[Squares["E8"] = 95] = "E8";
    Squares[Squares["F8"] = 96] = "F8";
    Squares[Squares["G8"] = 97] = "G8";
    Squares[Squares["H8"] = 98] = "H8";
    Squares[Squares["NO_SQ"] = 99] = "NO_SQ";
    Squares[Squares["OFF_BOARD"] = 100] = "OFF_BOARD";
})(Squares || (Squares = {}));
var CastleBit;
(function (CastleBit) {
    CastleBit[CastleBit["WhiteKingCastle"] = 1] = "WhiteKingCastle";
    CastleBit[CastleBit["WhiteQueenCastle"] = 2] = "WhiteQueenCastle";
    CastleBit[CastleBit["BlackKingCastle"] = 4] = "BlackKingCastle";
    CastleBit[CastleBit["BlackQueenCastle"] = 8] = "BlackQueenCastle";
})(CastleBit || (CastleBit = {}));
var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 256;
var MAXDEPTH = 64;
var filesBoard = [];
var ranksBoard = [];
function fileRankToSqr(file, rank) {
    //converts the file and rank number to the square number
    return ((21 + (file)) + ((rank) * 10));
}
var start_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var pceChar = ".PNBRQKpnbrqk";
var sideChar = "wb-";
var rankChar = "12345678";
var fileChar = "abcdefgh";
var PieceBig = [false, false, true, true, true, true, true, false, true, true, true, true, true];
var PieceMaj = [false, false, false, false, true, true, true, false, false, false, true, true, true];
var PieceMin = [false, false, true, true, false, false, false, false, true, true, false, false, false];
var PiecePawn = [false, true, false, false, false, false, false, true, false, false, false, false, false];
var PieceKnight = [false, false, true, false, false, false, false, false, true, false, false, false, false];
var PieceKing = [false, false, false, false, false, false, true, false, false, false, false, false, true];
var PieceRookQueen = [false, false, false, false, true, true, false, false, false, false, true, true, false];
var PieceBishopQueen = [false, false, false, true, false, true, false, false, false, true, false, true, false];
var PieceSlides = [false, false, false, true, true, true, false, false, false, true, true, true, false];
var PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
var PieceCol = [Colors.BOTH, Colors.WHITE, Colors.WHITE, Colors.WHITE, Colors.WHITE, Colors.WHITE, Colors.WHITE,
    Colors.BLACK, Colors.BLACK, Colors.BLACK, Colors.BLACK, Colors.BLACK, Colors.BLACK];
var pieceKeys = new Array(14 * 120);
var sideKey = 0;
var castleKeys = new Array(16);
var sq120ToSq64 = new Array(BRD_SQ_NUM);
var sq64ToSq120 = new Array(64);
function RAND_32() {
    return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16) |
        (Math.floor((Math.random() * 255) + 1) << 8) | (Math.floor((Math.random() * 255) + 1));
}
//-----------------------------------GameBoard
function PCEINDEX(pce, pceNum) {
    return (pce * 10 + pceNum);
}
var GameBoard = {
    pieces: new Array(BRD_SQ_NUM),
    side: Colors.WHITE,
    fiftyMove: 0,
    hisPlay: 0,
    ply: 0,
    material: new Array(2),
    enPassant: 0,
    castlePerm: 0,
    /*
    For GameBoard.castlePerm:
        0001 - White King Castle Permission
        0010 - White Queen Castle Permission
        0100 - Black King Castle Permission
        1000 - Black Queen Castle Permission

        EX:
            Determined via Bit-wise &&
            1101 = 13
            White can castle King side, can't castle queen side
            Black can castle king and queen side
    */
    pceNum: new Array(13),
    pList: new Array(14 * 10),
    posKey: 0,
    moveList: new Array(MAXDEPTH * MAXPOSITIONMOVES),
    moveScores: new Array(MAXDEPTH * MAXPOSITIONMOVES),
    moveListStart: new Array(MAXDEPTH)
};
function PrintBoard() {
    var sq, file, rank, piece;
    console.log("\nGame Board:\n");
    for (rank = Ranks.RANK_8; rank >= Ranks.RANK_1; rank--) {
        var line_1 = (rankChar[rank] + " ");
        for (file = Files.FILE_A; file <= Files.FILE_H; file++) {
            sq = fileRankToSqr(file, rank);
            piece = GameBoard.pieces[sq];
            line_1 += (" " + pceChar[piece] + " ");
        }
        console.log(line_1);
    }
    console.log("");
    var line = "    ";
    for (file = Files.FILE_A; file <= Files.FILE_H; file++) {
        line += (' ' + fileChar[file] + ' ');
    }
    console.log(line);
    console.log("side:" + sideChar[GameBoard.side]);
    console.log("enPas: " + GameBoard.enPassant);
    line = "";
    if (GameBoard.castlePerm & CastleBit.WhiteKingCastle)
        line += 'K';
    if (GameBoard.castlePerm & CastleBit.WhiteQueenCastle)
        line += 'Q';
    if (GameBoard.castlePerm & CastleBit.BlackKingCastle)
        line += 'k';
    if (GameBoard.castlePerm & CastleBit.BlackQueenCastle)
        line += 'q';
    console.log("castle:" + line);
    console.log("key:" + GameBoard.posKey.toString(16));
}
function GeneratePosKey() {
    var sq = 0;
    var finalKey = 0;
    var piece = Pieces.EMPTY;
    for (sq = 0; sq < BRD_SQ_NUM; ++sq) {
        piece = GameBoard.pieces[sq];
        if (piece != Pieces.EMPTY && piece != Squares.OFF_BOARD) {
            finalKey ^= pieceKeys[(piece * 120) + sq];
        }
    }
    if (GameBoard.side == Colors.WHITE) {
        finalKey ^= sideKey;
    }
    if (GameBoard.enPassant != Squares.NO_SQ) {
        finalKey ^= pieceKeys[GameBoard.enPassant];
    }
    finalKey ^= castleKeys[GameBoard.castlePerm];
    return finalKey;
}
function ResetBoard() {
    var index = 0;
    for (index = 0; index < BRD_SQ_NUM; ++index) {
        GameBoard.pieces[index] = Squares.OFF_BOARD;
    }
    for (index = 0; index < 64; ++index) {
        GameBoard.pieces[SQ120(index)] = Pieces.EMPTY;
    }
    for (index = 0; index < 14 * 120; ++index) {
        GameBoard.pList[index] = Pieces.EMPTY;
    }
    for (index = 0; index < 2; ++index) {
        GameBoard.material[index] = 0;
    }
    for (index = 0; index < 13; ++index) {
        GameBoard.pceNum[index] = 0;
    }
    GameBoard.side = Colors.BOTH;
    GameBoard.enPassant = Squares.NO_SQ;
    GameBoard.fiftyMove = 0;
    GameBoard.ply = 0;
    GameBoard.hisPlay = 0;
    GameBoard.castlePerm = 0;
    GameBoard.posKey = 0;
    GameBoard.moveListStart[GameBoard.ply] = 0;
}
function parseFenKey(fen) {
    ResetBoard();
    var rank = Ranks.RANK_8;
    var file = Files.FILE_A;
    var piece = 0;
    var count = 0;
    var i = 0;
    var sq120 = 0;
    var fenCnt = 0;
    while ((rank >= Ranks.RANK_1) && fenCnt < fen.length) {
        count = 1;
        switch (fen[fenCnt]) {
            case 'p':
                piece = Pieces.BLACK_PAWN;
                break;
            case 'r':
                piece = Pieces.BLACK_ROOK;
                break;
            case 'n':
                piece = Pieces.BLACK_KNIGHT;
                break;
            case 'b':
                piece = Pieces.BLACK_BISHOP;
                break;
            case 'k':
                piece = Pieces.BLACK_KING;
                break;
            case 'q':
                piece = Pieces.BLACK_QUEEN;
                break;
            case 'P':
                piece = Pieces.WHITE_PAWN;
                break;
            case 'R':
                piece = Pieces.WHITE_ROOK;
                break;
            case 'N':
                piece = Pieces.WHITE_KNIGHT;
                break;
            case 'B':
                piece = Pieces.WHITE_BISHOP;
                break;
            case 'K':
                piece = Pieces.WHITE_KING;
                break;
            case 'Q':
                piece = Pieces.WHITE_QUEEN;
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = Pieces.EMPTY;
                count = Number(fen[fenCnt]);
                break;
            case '/':
            case ' ':
                rank--;
                file = Files.FILE_A;
                fenCnt++;
                continue;
            default:
                console.log("FEN error");
                return;
        }
        for (i = 0; i < count; i++) {
            sq120 = fileRankToSqr(file, rank);
            GameBoard.pieces[sq120] = piece;
            file++;
        }
        fenCnt++;
    } //while loop end
    GameBoard.side = (fen[fenCnt] == 'w') ? Colors.WHITE : Colors.BLACK;
    fenCnt += 2;
    for (var i_1 = 0; i_1 < 4; ++i_1) {
        if (fen[fenCnt] == ' ') {
            break;
        }
        switch (fen[fenCnt]) {
            case 'K':
                GameBoard.castlePerm |= CastleBit.WhiteKingCastle;
                break;
            case 'Q':
                GameBoard.castlePerm |= CastleBit.WhiteQueenCastle;
                break;
            case 'k':
                GameBoard.castlePerm |= CastleBit.BlackKingCastle;
                break;
            case 'q':
                GameBoard.castlePerm |= CastleBit.BlackQueenCastle;
                break;
            default:
                break;
        }
        fenCnt++;
    }
    fenCnt++;
    if (fen[fenCnt] != '-') {
        file = Number(fen[fenCnt]);
        rank = Number(fen[fenCnt + 1]);
        console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);
        GameBoard.enPassant = fileRankToSqr(file, rank);
    }
    GameBoard.posKey = GeneratePosKey();
}
//-----------------Main 
$(function () {
    init();
    parseFenKey(start_fen);
    PrintBoard();
});
function InitHashKeys() {
    var index = 0;
    for (index = 0; index < 14 * 120; ++index) {
        pieceKeys[index] = RAND_32();
    }
    sideKey = RAND_32();
    for (index = 0; index < 16; ++index) {
        castleKeys[index] = RAND_32();
    }
}
function initFilesRanksBoard() {
    var index = 0;
    var file = Files.FILE_A;
    var rank = Ranks.RANK_1;
    var sqrNum = Squares.A1;
    //initialize all squares to out of bounds
    for (index = 0; index < BRD_SQ_NUM; ++index) {
        filesBoard[index] = Squares.OFF_BOARD;
        ranksBoard[index] = Squares.OFF_BOARD;
    }
    //assign the appropriate/valid locations
    for (rank = Ranks.RANK_1; rank <= Ranks.RANK_8; ++rank) {
        for (file = Files.FILE_A; file <= Files.FILE_H; ++file) {
            sqrNum = fileRankToSqr(file, rank);
            filesBoard[sqrNum] = file;
            ranksBoard[sqrNum] = rank;
        }
    }
    console.log("Filesbrd[0]: " + filesBoard[0] + " ranksBoard[0]: " + ranksBoard[0]);
    console.log("FilesBoard[Squares.A1]: " + filesBoard[Squares.A1] + " Ranks Board: [A1]: " + ranksBoard[Squares.A1]);
    console.log("FilesBoard[Squares.E8]: " + filesBoard[Squares.E8] + " RanksBoard[e8]: " + ranksBoard[Squares.E8]);
}
function initSq120To64() {
    var index = 0;
    var file = Files.FILE_A;
    var rank = Ranks.RANK_1;
    var sqr = Squares.A1;
    var sqr64 = 0;
    for (index = 0; index < BRD_SQ_NUM; ++index) {
        sq120ToSq64[index] = 65;
    }
    for (index = 0; index < 64; ++index) {
        sq64ToSq120[index] = 120;
    }
    for (rank = Ranks.RANK_1; rank <= Ranks.RANK_8; ++rank) {
        for (file = Files.FILE_A; file <= Files.FILE_H; ++file) {
            sqr = fileRankToSqr(file, rank);
            sq64ToSq120[sqr64] = sqr;
            sq120ToSq64[sqr] = sqr64;
            sqr64++;
        }
    }
}
function SQ64(sq120) {
    return sq120ToSq64[(sq120)];
}
function SQ120(sq64) {
    return sq64ToSq120[(sq64)];
}
function init() {
    initFilesRanksBoard();
    InitHashKeys();
    console.log("init called");
}
