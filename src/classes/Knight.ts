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
	const lettersArray = ["x","x", "a", "b", "c", "d", "e", "f", "g", "h", "x", "x"];		// If a new move goes off the board, "checkPossibleMove" will know because the letter in the square will be "x".
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


	if (this.checkPossibleMove(newMoveUpLeft)) {
		possibleMoves.push(newMoveUpLeft);
	} else {																		// Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveUpLeft);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveUpLeft);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveUpRight)) {
		possibleMoves.push(newMoveUpRight);
	} else {																		// Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveUpRight);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveUpRight);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveLeftUp)) {
		possibleMoves.push(newMoveLeftUp);
	} else {																		// Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveLeftUp);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveLeftUp);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveLeftDown)) {
		possibleMoves.push(newMoveLeftDown);
	} else {																		// Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveLeftDown);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveLeftDown);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveRightUp)) {
		possibleMoves.push(newMoveRightUp);
	} else {																		// Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveRightUp);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveRightUp);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveRightDown)) {
		possibleMoves.push(newMoveRightDown);
	} else {																		// Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveRightDown);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveRightDown);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveDownLeft)) {
		possibleMoves.push(newMoveDownLeft);
	} else {																		// Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveDownLeft);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveDownLeft);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveDownRight)) {
		possibleMoves.push(newMoveDownRight);
	} else {																		// Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveDownRight);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveDownRight);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
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