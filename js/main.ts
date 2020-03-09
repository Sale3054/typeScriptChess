//Helper Definitions
// -----------------------------------------------------
let BRD_SQ_NUM: number = 120;

enum Pieces
{
    EMPTY = 0,
    WHITE_PAWN,
    WHITE_KNIGHT,
    WHITE_BISHOP,
    WHITE_ROOK,
    WHITE_QUEEN,
    WHITE_KING,
    BLACK_PAWN,
    BLACK_KNIGHT,
    BLACK_BISHOP,
    BLACK_ROOK,
    BLACK_QUEEN,
    BLACK_KING
}

enum Files 
{
    FILE_A,
    FILE_B,
    FILE_C,
    FILE_D,
    FILE_E,
    FILE_F,
    FILE_G,
    FILE_H,
    FILE_NONE
}

enum Ranks 
{
    RANK_1,
    RANK_2,
    RANK_3,
    RANK_4,
    RANK_5,
    RANK_6,
    RANK_7,
    RANK_8,
    RANK_NONE
}

enum Colors 
{
    WHITE,
    BLACK,
    BOTH
}

enum Squares
{
    A1 = 21,
    B1 = 22,
    C1 = 23,
    D1 = 24,
    E1 = 25,
    F1 = 26,
    G1 = 27,
    H1 = 28,
    A8 = 91,
    B8 = 92,
    C8 = 93,
    D8 = 94,
    E8 = 95,
    F8 = 96,
    G8 = 97,
    H8 = 98,
    NO_SQ = 99,
    OFF_BOARD = 100
}

enum CastleBit 
{
    WhiteKingCastle = 1,
    WhiteQueenCastle = 2,
    BlackKingCastle = 4,
    BlackQueenCastle = 8
}

let MAXGAMEMOVES : number = 2048;
let MAXPOSITIONMOVES : number = 256;
let MAXDEPTH : number = 64;

let filesBoard : Array<number> = [];
let ranksBoard : Array<number> = [];

function fileRankToSqr(file, rank)
{
    //converts the file and rank number to the square number
    return ((21 + (file)) + ((rank) * 10));
}

let start_fen:string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let pceChar:string = ".PNBRQKpnbrqk";
let sideChar:string = "wb-";
let rankChar:string = "12345678";
let fileChar:string = "abcdefgh";

let PieceBig: Array<boolean> = [ false, false, true, true, true, true, true, false, true, true, true, true, true ];
let PieceMaj: Array<boolean> = [ false, false, false, false, true, true, true, false, false, false, true, true, true ];
let PieceMin: Array<boolean> = [ false, false, true, true, false, false, false, false, true, true, false, false, false ];
let PiecePawn: Array<boolean> = [ false, true, false, false, false, false, false, true, false, false, false, false, false ];	
let PieceKnight: Array<boolean> = [ false, false, true, false, false, false, false, false, true, false, false, false, false ];
let PieceKing: Array<boolean> = [ false, false, false, false, false, false, true, false, false, false, false, false, true ];
let PieceRookQueen: Array<boolean> =  [ false, false, false, false, true, true, false, false, false, false, true, true, false ];
let PieceBishopQueen: Array<boolean> =  [ false, false, false, true, false, true, false, false, false, true, false, true, false ];
let PieceSlides: Array<boolean> =  [ false, false, false, true, true, true, false, false, false, true, true, true, false ];

let PieceVal: Array<number> = [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
let PieceCol: Array<number> = [ Colors.BOTH, Colors.WHITE, Colors.WHITE, Colors.WHITE, Colors.WHITE, Colors.WHITE, Colors.WHITE,
                 Colors.BLACK, Colors.BLACK, Colors.BLACK, Colors.BLACK, Colors.BLACK, Colors.BLACK ];
                 
let pieceKeys: Array<number> = new Array(14*120);
let sideKey = 0;
let castleKeys: Array<number> = new Array(16);

let sq120ToSq64: Array<number> = new Array(BRD_SQ_NUM);
let sq64ToSq120: Array<number> = new Array(64);

function RAND_32(): number
{
    return (Math.floor((Math.random()*255) + 1) << 23) | (Math.floor((Math.random()*255) + 1) << 16) | 
           (Math.floor((Math.random()*255) + 1) << 8)  | (Math.floor((Math.random()*255) + 1));
}

//-----------------------------------GameBoard

function PCEINDEX(pce: number, pceNum: number): number
{
    return (pce * 10 + pceNum);
}

var GameBoard = {
    pieces : new Array<number>(BRD_SQ_NUM),
    side  : Colors.WHITE,
    fiftyMove : 0,
    hisPlay : 0,
    ply : 0,
    material : new Array<number>(2),
    enPassant: 0,
    castlePerm : 0,
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
   pceNum : new Array<number>(13),
   pList : new Array<number>(14*10),
   posKey : 0,
   moveList : new Array(MAXDEPTH * MAXPOSITIONMOVES),
   moveScores : new Array(MAXDEPTH * MAXPOSITIONMOVES),
   moveListStart : new Array(MAXDEPTH)
};

function PrintBoard()
{
    let sq, file, rank, piece;
    console.log("\nGame Board:\n");

    for(rank = Ranks.RANK_8; rank >= Ranks.RANK_1; rank--)
    {
        let line = (rankChar[rank] + " ");
        for (file = Files.FILE_A; file <= Files.FILE_H; file++)
        {
            sq = fileRankToSqr(file, rank);
            piece = GameBoard.pieces[sq];

            line += (" " + pceChar[piece] + " ");
        }
        console.log(line);
    }
    console.log("");

    let line:string = "    ";
    for (file = Files.FILE_A; file <= Files.FILE_H; file++)
    {
        line += (' ' + fileChar[file] + ' ');
    }

    console.log(line);
    console.log("side:" + sideChar[GameBoard.side]);
    console.log("enPas: " + GameBoard.enPassant);

    line = "";

    if (GameBoard.castlePerm & CastleBit.WhiteKingCastle) line += 'K';
    if (GameBoard.castlePerm & CastleBit.WhiteQueenCastle) line += 'Q';
    if (GameBoard.castlePerm & CastleBit.BlackKingCastle) line += 'k';
    if (GameBoard.castlePerm & CastleBit.BlackQueenCastle) line += 'q';
    
    console.log("castle:" + line);
    console.log("key:" + GameBoard.posKey.toString(16));
}

function GeneratePosKey(): number
{
    let sq : number = 0;
    let finalKey : number = 0;
    let piece : number = Pieces.EMPTY;

    for (sq = 0; sq < BRD_SQ_NUM; ++sq)
    {
        piece = GameBoard.pieces[sq];
        if (piece != Pieces.EMPTY && piece != Squares.OFF_BOARD)
        {
            finalKey ^= pieceKeys[(piece * 120) + sq];
        }
    }

    if (GameBoard.side == Colors.WHITE)
    {
        finalKey ^= sideKey;
    }

    if (GameBoard.enPassant != Squares.NO_SQ)
    {
        finalKey ^= pieceKeys[GameBoard.enPassant];
    }

    finalKey ^= castleKeys[GameBoard.castlePerm];

    return finalKey;
}
function ResetBoard(): void
{
    let index:number = 0;
    for (index = 0; index < BRD_SQ_NUM; ++index)
    {
        GameBoard.pieces[index] = Squares.OFF_BOARD;
    }

    for (index = 0; index < 64; ++index)
    {
        GameBoard.pieces[SQ120(index)] = Pieces.EMPTY;
    }

    for (index = 0; index < 14 * 120; ++index)
    {
        GameBoard.pList[index] = Pieces.EMPTY;
    }

    for (index = 0; index < 2; ++index)
    {
        GameBoard.material[index] = 0;
    }

    for (index = 0; index < 13; ++index)
    {
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

function parseFenKey(fen:string): void
{
    ResetBoard();

    let rank:number = Ranks.RANK_8;
    let file:number = Files.FILE_A;
    let piece:number = 0;
    let count:number = 0;
    let i:number = 0;
    let sq120:number = 0;
    let fenCnt:number = 0;

    while((rank >= Ranks.RANK_1) && fenCnt < fen.length)
    {
        count = 1;
        switch (fen[fenCnt])
        {
            case 'p': piece = Pieces.BLACK_PAWN; break;
            case 'r': piece = Pieces.BLACK_ROOK; break;
            case 'n': piece = Pieces.BLACK_KNIGHT; break;
            case 'b': piece = Pieces.BLACK_BISHOP; break;
            case 'k': piece = Pieces.BLACK_KING; break;
            case 'q': piece = Pieces.BLACK_QUEEN; break;
            case 'P': piece = Pieces.WHITE_PAWN; break;
            case 'R': piece = Pieces.WHITE_ROOK; break;
            case 'N': piece = Pieces.WHITE_KNIGHT; break;
            case 'B': piece = Pieces.WHITE_BISHOP; break;
            case 'K': piece = Pieces.WHITE_KING; break;
            case 'Q': piece = Pieces.WHITE_QUEEN; break;

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
                rank --;
                file = Files.FILE_A;
                fenCnt++;
                continue;
            default:
                console.log("FEN error");
                return;

        }
        for (i = 0; i < count; i ++)
        {
            sq120 = fileRankToSqr(file, rank);
            GameBoard.pieces[sq120] = piece;
            file++;
        }
        fenCnt++;
    } //while loop end

    GameBoard.side = (fen[fenCnt] == 'w') ? Colors.WHITE : Colors.BLACK;
    fenCnt += 2;
    
    for (let i = 0; i <4; ++i)
    {
        if (fen[fenCnt] == ' ')
        {
            break;
        }
        switch(fen[fenCnt])
        {
            case 'K': GameBoard.castlePerm |= CastleBit.WhiteKingCastle; break;
            case 'Q': GameBoard.castlePerm |= CastleBit.WhiteQueenCastle; break;
            case 'k': GameBoard.castlePerm |= CastleBit.BlackKingCastle; break;
            case 'q': GameBoard.castlePerm |= CastleBit.BlackQueenCastle; break;
            default:
                break;
        }
        fenCnt++;
    }
    fenCnt++;

    if (fen[fenCnt] != '-')
    {
        file = Number(fen[fenCnt]);
        rank = Number(fen[fenCnt + 1]);
        console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);
        GameBoard.enPassant = fileRankToSqr(file, rank);
    }

    GameBoard.posKey = GeneratePosKey();
}

//-----------------Main 
$(function() //Main function
{
    init();
    parseFenKey(start_fen);
    PrintBoard();
});

function InitHashKeys(): void
{
    let index: number = 0;

    for (index = 0; index < 14*120; ++index)
    {
        pieceKeys[index] = RAND_32();
    }

    sideKey = RAND_32();

    for (index = 0; index < 16; ++index)
    {
        castleKeys[index] = RAND_32();
    }
}
function initFilesRanksBoard(): void
{
    let index = 0;
    let file = Files.FILE_A;
    let rank = Ranks.RANK_1;
    let sqrNum = Squares.A1;

    //initialize all squares to out of bounds
    for(index = 0; index < BRD_SQ_NUM; ++index)
    {
        filesBoard[index] = Squares.OFF_BOARD;
        ranksBoard[index] = Squares.OFF_BOARD;
    }

    //assign the appropriate/valid locations

    for (rank = Ranks.RANK_1; rank <= Ranks.RANK_8; ++rank)
    {
        for (file = Files.FILE_A; file <= Files.FILE_H; ++file)
        {
            sqrNum = fileRankToSqr(file, rank);
            filesBoard[sqrNum] = file;
            ranksBoard[sqrNum] = rank;

        }
    }
    console.log("Filesbrd[0]: " + filesBoard[0] + " ranksBoard[0]: " + ranksBoard[0]);
    console.log("FilesBoard[Squares.A1]: " + filesBoard[Squares.A1] + " Ranks Board: [A1]: " + ranksBoard[Squares.A1]);
    console.log("FilesBoard[Squares.E8]: " + filesBoard[Squares.E8] + " RanksBoard[e8]: " + ranksBoard[Squares.E8]);
}

function initSq120To64(): void
{
    let index: number = 0;
    let file = Files.FILE_A;
    let rank = Ranks.RANK_1;
    let sqr = Squares.A1;
    let sqr64 = 0;

    for (index = 0; index < BRD_SQ_NUM; ++index)
    {
        sq120ToSq64[index] = 65;
    }

    for (index = 0; index < 64; ++index)
    {
        sq64ToSq120[index] = 120;
    }
    
    for (rank = Ranks.RANK_1; rank <= Ranks.RANK_8; ++rank)
    {
        for (file = Files.FILE_A; file <= Files.FILE_H; ++file)
        {
            sqr = fileRankToSqr(file, rank);
            sq64ToSq120[sqr64] = sqr;
            sq120ToSq64[sqr] = sqr64;
            sqr64++;
        }

    }
}

function SQ64(sq120): number
{
    return sq120ToSq64[(sq120)];
}

function SQ120(sq64): number
{
    return sq64ToSq120[(sq64)];
}

function init(): void
{
    initFilesRanksBoard();
    InitHashKeys();
    console.log("init called");
}
