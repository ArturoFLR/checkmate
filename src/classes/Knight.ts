import { piecesData } from "../globals/gameData";
import Piece from "./Piece";

class Knight extends Piece {
	constructor( id: string, player: "b" | "w", image: string, square: string ){
		super(id, player, image, square);
	}

	calcPossibleMoves = calcPossibleMoves;
	movePiece = movePiece;
}

export default Knight;


function calcPossibleMoves ( this: Knight ) {
	const squareLetter = this.square[0];
	const squareNumber = Number(this.square[1]);
	const lettersArray = ["x","x", "a", "b", "c", "d", "e", "f", "g", "h", "x", "x"];		// If a new move goes off the board, "testSquareExists" will know because the letter in the square will be "x".
	const squareLetterIndex = lettersArray.findIndex( (element ) => element === squareLetter);		// Saves the index of lettersArray in which the letter of the current square is located.

	const possibleMoves: string[] = [];										// Stores the list of possible moves.
	const impossibleMovesForKings: string[] = [];							// It saves moves which cannot be made now because there is a friendly piece in the square, but would affect the king if it moves to those possible capture squares.								

	const newMoveUpLeft = lettersArray[squareLetterIndex - 1] + (squareNumber + 2);				// These variables store a new possible move, which will be checked before adding it to "possibleMoves".
	const newMoveUpRight = lettersArray[squareLetterIndex + 1] + (squareNumber + 2);
	const newMoveLeftUp = lettersArray[squareLetterIndex - 2] + (squareNumber + 1);
	const newMoveLeftDown = lettersArray[squareLetterIndex - 2] + (squareNumber - 1);
	const newMoveRightUp = lettersArray[squareLetterIndex + 2] + (squareNumber + 1);
	const newMoveRightDown = lettersArray[squareLetterIndex + 2] + (squareNumber - 1);	
	const newMoveDownLeft = lettersArray[squareLetterIndex - 1] + (squareNumber - 2);
	const newMoveDownRight = lettersArray[squareLetterIndex + 1] + (squareNumber - 2);	


	if (this.testSquareExists(newMoveUpLeft)) {										// UP - LEFT
		if (this.testSquareContainsFriendlyPiece(newMoveUpLeft)) {
			impossibleMovesForKings.push(newMoveUpLeft);							// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
		} else {
			possibleMoves.push(newMoveUpLeft);
		}
	}



	if (this.testSquareExists(newMoveUpRight)) {										// UP - RIGHT
		if (this.testSquareContainsFriendlyPiece(newMoveUpRight)) {
			impossibleMovesForKings.push(newMoveUpRight);							// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
		} else {
			possibleMoves.push(newMoveUpRight);
		}
	}



	if (this.testSquareExists(newMoveLeftUp)) {										// LEFT - UP 
		if (this.testSquareContainsFriendlyPiece(newMoveLeftUp)) {
			impossibleMovesForKings.push(newMoveLeftUp);							// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
		} else {
			possibleMoves.push(newMoveLeftUp);
		}
	}



	if (this.testSquareExists(newMoveLeftDown)) {										// LEFT - DOWN 
		if (this.testSquareContainsFriendlyPiece(newMoveLeftDown)) {
			impossibleMovesForKings.push(newMoveLeftDown);							// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
		} else {
			possibleMoves.push(newMoveLeftDown);
		}
	}



	if (this.testSquareExists(newMoveRightUp)) {										// RIGHT - UP 
		if (this.testSquareContainsFriendlyPiece(newMoveRightUp)) {
			impossibleMovesForKings.push(newMoveRightUp);							// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
		} else {
			possibleMoves.push(newMoveRightUp);
		}
	}



	if (this.testSquareExists(newMoveRightDown)) {										// RIGHT - DOWN 
		if (this.testSquareContainsFriendlyPiece(newMoveRightDown)) {
			impossibleMovesForKings.push(newMoveRightDown);							// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
		} else {
			possibleMoves.push(newMoveRightDown);
		}
	}



	if (this.testSquareExists(newMoveDownLeft)) {										// DOWN - LEFT 
		if (this.testSquareContainsFriendlyPiece(newMoveDownLeft)) {
			impossibleMovesForKings.push(newMoveDownLeft);							// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
		} else {
			possibleMoves.push(newMoveDownLeft);
		}
	}



	if (this.testSquareExists(newMoveDownRight)) {										// DOWN - RIGHT 
		if (this.testSquareContainsFriendlyPiece(newMoveDownRight)) {
			impossibleMovesForKings.push(newMoveDownRight);							// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
		} else {
			possibleMoves.push(newMoveDownRight);
		}
	}

	this.possibleMoves = possibleMoves;
	this.impossibleMovesForKings = impossibleMovesForKings;
}



function movePiece ( this: Knight, targetSquare: string ) {
	this.square = targetSquare;

	piecesData.pieces.map( (element) => {		
		if (element.player !== this.player && element.square === targetSquare) {
			element.die();
		}
	});

	this.animateMove(targetSquare);
}