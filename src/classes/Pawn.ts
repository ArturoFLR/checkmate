import styles from "../components/Board.module.scss";
import { completeTurnData, enPassantTargetData, halfTurnData, lastPawnMovedData, piecesData, transformedPieceToAnimateData } from "../globals/gameData";
import Bishop from "./Bishop";
import Knight from "./Knight";
import Piece from "./Piece";
import { PiecesType } from "./PiecesType";
import Queen from "./Queen";
import Rook from "./Rook";

class Pawn extends Piece {
	public isFirstMove = true;
	public possibleMovesForKings: string[] = [];												// A pawn cannot capture in a straight line, so we keep a set of moves that are possible for the pawn but do not entail risk for the kings.
	constructor( id: string, player: "b" | "w", image: string, square: string ){
		super(id, player, image, square);
	}

	calcPossibleMoves = calcPossibleMoves;
	movePiece = movePiece;
	transform = transform;
}

export default Pawn;


function calcPossibleMoves  ( this: Pawn ) {
	const squareLetter = this.square[0];
	const squareNumber = Number(this.square[1]);
	const lettersArray = ["x", "a", "b", "c", "d", "e", "f", "g", "h", "x"];		// If a new move goes off the board, "testSquareExists" will know because the letter in the square will be "x".
	const squareLetterIndex = lettersArray.findIndex( (element ) => element === squareLetter);		// Saves the index of lettersArray in which the letter of the current square is located.
	let isOneSquareMovementPossible = false;

	const possibleMoves: string[] = [];										// Save the list of possible moves.
	let newMove: string = "";												// Saves a new possible move, which will be checked before adding it to "possibleMoves".

	const impossibleMovesForKings: string[] = [];								// It saves possible capture moves (diagonally), which cannot be made now because there are no enemy pieces, but would affect the king if it moves to those possible capture squares.	
	const possibleMovesForKings: string[] = [];								    // A pawn cannot capture in a straight line, so we keep a set of moves that are possible for the pawn but do not entail risk for the kings.

	// Move one square forward. The white pieces advance in the opposite way to the black pieces.

	if (this.player === "w") {												
		newMove = squareLetter + (squareNumber + 1);							
	} else {
		newMove = squareLetter + (squareNumber - 1);
	}

	if (this.testSquareExists(newMove)) {

		if (this.testSquareContainsEnemyPiece(newMove) || this.testSquareContainsFriendlyPiece(newMove) ) {			// If the move is possible, check that there is not already a piece in that square (a pawn cannot capture from the front).
			null;
		} else {
			possibleMoves.push(newMove);
			possibleMovesForKings.push(newMove);
			isOneSquareMovementPossible = true;
		}

	}


	//  Move two spaces forward, only if it is the first move and the "move one square forward" movement is possible. This is to prevent the pawn from being able to move 2 squares if it can't move one (it could move by jumping over another piece).

	if (this.isFirstMove && isOneSquareMovementPossible) {											
		if (this.player === "w") {												
			newMove = squareLetter + (squareNumber + 2);							
		} else {
			newMove = squareLetter + (squareNumber - 2);
		}

		if (this.testSquareExists(newMove)) {

			if (this.testSquareContainsEnemyPiece(newMove) || this.testSquareContainsFriendlyPiece(newMove) ) {			// If the move is possible, check that there is not already a piece in that square (a pawn cannot capture from the front).
				null;
			} else {
				possibleMoves.push(newMove);
				possibleMovesForKings.push(newMove);
			}

		}
	}

	// Capture an opponent by moving one square up(w) / down(b) and one to the left.

	if (this.player === "w") {													
		newMove = lettersArray[squareLetterIndex - 1] + (squareNumber + 1);						
	} else {
		newMove = lettersArray[squareLetterIndex - 1] + (squareNumber - 1);
	}
	
	if (this.testSquareExists(newMove)) {
		if (this.testSquareContainsEnemyPiece(newMove)) {								// If there is an enemy piece, the move is valid.
			possibleMoves.push(newMove);
		} else {																		// If there is a friendly piece  or the square it´s empty, it´s not a valid move, but it´s saved because it would affect the king (check) if it captures that piece.
			impossibleMovesForKings.push(newMove);	
		}
	}



	// Capture an opponent by moving one square up(w) / down(b) and one to the right.

	if (this.player === "w") {													
		newMove = lettersArray[squareLetterIndex + 1] + (squareNumber + 1);						
	} else {
		newMove = lettersArray[squareLetterIndex + 1] + (squareNumber - 1);
	}
	
	if (this.testSquareExists(newMove)) {
		if (this.testSquareContainsEnemyPiece(newMove)) {								// If there is an enemy piece, the move is valid.
			possibleMoves.push(newMove);
		} else {																		// If there is a friendly piece  or the square it´s empty, it´s not a valid move, but it´s saved because it would affect the king (check) if it captures that piece.
			impossibleMovesForKings.push(newMove);	
		}
	}


	
	// Check if an en passant capture is possible

	if (enPassantTargetData.enPassantTargetCounter && enPassantTargetData.enPassantTargetCounter === 1) {
		const enPassantSquare = enPassantTargetData.enPassantTargetSquare;
		const enPassantSquareLetter = enPassantSquare[0];
		const enPassantSquareNumber = Number(enPassantSquare[1]);

		if (this.player === "w" && squareNumber === 5) {													
			
			if ((enPassantSquareLetter === lettersArray[squareLetterIndex - 1] || enPassantSquareLetter === lettersArray[squareLetterIndex + 1]) && enPassantSquareNumber === squareNumber + 1) {
				newMove = enPassantSquare;
				possibleMoves.push(newMove);
			}

		} else if (this.player === "b" && squareNumber === 4) {
			
			if (enPassantSquareLetter === lettersArray[squareLetterIndex - 1] || enPassantSquareLetter === lettersArray[squareLetterIndex + 1] && enPassantSquareNumber === squareNumber - 1) {
				newMove = enPassantSquare;
				possibleMoves.push(newMove);
			}
		}
	}
	
	this.possibleMoves = possibleMoves;
	this.impossibleMovesForKings = impossibleMovesForKings;
	this.possibleMovesForKings = possibleMovesForKings;
}



function movePiece ( this: Pawn, targetSquare: string ) {
	const targetSquareLetter = targetSquare[0];
	const targetSquareNumber = Number(targetSquare[1]);
	const actualSquareNumber = Number(this.square[1]);
	
	if (targetSquareNumber - actualSquareNumber === 2 || actualSquareNumber - targetSquareNumber === 2 ) {			// Sets the target square of an "en passant" capture. It is calculated differently for black and white.
		let enPassantSquare: string;

		if (this.player === "w") {
			enPassantSquare = targetSquareLetter + (targetSquareNumber - 1);
		} else {
			enPassantSquare = targetSquareLetter + (targetSquareNumber + 1);
		}
		enPassantTargetData.setEnPassantTarget(enPassantSquare, 0);
	}

	if (targetSquare === enPassantTargetData.enPassantTargetSquare && enPassantTargetData.enPassantTargetCounter === 1) {		// If the move is to a square targeted by an en passant capture, the piece that generated that square is eliminated.
		piecesData.pieces.map( (element) => {
			if (element.id === lastPawnMovedData.lastPawnMoved) element.die();
		});
	}

	if(this.isFirstMove === true) this.isFirstMove = false;																		// It will no longer be the 1st movement of this piece.

	piecesData.pieces.map( (element) => {		
		if (element.player !== this.player && element.square === targetSquare) {
			element.die();
		}
	});

	lastPawnMovedData.setLastPawnMoved(this.id);													// Update the value of "lastPawnMoved" with the id of this piece that was just moved.
	
	this.animateMove(targetSquare);

	halfTurnData.setHalfTurn(0);
	
	this.square = targetSquare;
}


function transform ( this: Pawn, newPiece: string ) {
	const selectPieceElement = document.getElementById("selectPieceComponent") as HTMLDivElement;
	selectPieceElement.classList.add(styles.hideSelectPiece);											// Makes the "SelectPiece" component invisible again.

	let newPieceElement: PiecesType;
	let newPiecesList: PiecesType[] = [];

	const newId = completeTurnData.completeTurn;														// Generates unique identifiers (id) for the new pieces resulting from the transformation.

	switch (newPiece) {
	case "Q":
		newPieceElement = new Queen(`Q${newId}`, "w", "images/pieces/queenW.png", this.square);
		break;

	case "q":
		newPieceElement = new Queen(`q${newId}`, "b", "images/pieces/queenB.png", this.square);
		break;

	case "R":
		newPieceElement = new Rook(`R${newId}`, "w", "images/pieces/rookW.png", this.square);
		break;

	case "r":
		newPieceElement = new Rook(`r${newId}`, "b", "images/pieces/rookB.png", this.square);
		break;
	
	case "B":
		newPieceElement = new Bishop(`B${newId}`, "w", "images/pieces/bishopW.png", this.square);	
		break;

	case "b":
		newPieceElement = new Bishop(`o${newId}`, "b", "images/pieces/bishopB.png", this.square);
		break;

	case "K":
		newPieceElement = new Knight(`N${newId}`, "w", "images/pieces/knightW.png", this.square);
		break;

	case "k":
		newPieceElement = new Knight(`n${newId}`, "b", "images/pieces/knightB.png", this.square);
		break;
	
	default:
		break;
	}
	
	piecesData.pieces.map( (element) => {
		if (element.id !== this.id) {
			newPiecesList = [...newPiecesList, element];
		}
	});

	newPiecesList.push(newPieceElement!);
	piecesData.setPieces(newPiecesList);

	transformedPieceToAnimateData.setTransformedPieceToAnimate(newPieceElement!);
}