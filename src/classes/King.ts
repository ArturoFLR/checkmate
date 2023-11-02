import { piecesData } from "../globals/gameData";
import Piece from "./Piece";

class King extends Piece {
	hasMove: boolean = false;
	isCastlingPossible: boolean = false;
	isCheck: boolean = false;
	castlingSquares: string[];
	constructor( id: string, player: "b" | "w", image: string, square: string ){
		super(id, player, image, square);

		if (player === "w") {
			this.castlingSquares = ["g1", "c1"];
		} else {
			this.castlingSquares = ["g8", "c8"];
		}
	}

	calcPossibleMoves = calcPossibleMoves;
	movePiece = movePiece;
}

export default King;

function calcPossibleMoves ( this: King ) {
	const squareLetter = this.square[0];
	const squareNumber = Number(this.square[1]);
	const lettersArray = ["x", "a", "b", "c", "d", "e", "f", "g", "h", "x"];		// If a new move goes off the board, "checkPossibleMove" will know because the letter in the square will be "x".
	const squareLetterIndex = lettersArray.findIndex( (element ) => element === squareLetter);		// Saves the index of lettersArray in which the letter of the current square is located.
	const possibleMoves: string[] = [];		

	// This block calculates normal movement (one square in a straight line).

	const newMoveUp = squareLetter + (squareNumber + 1);							// These variables store a new possible move, which will be checked before adding it to "possibleMoves".
	const newMoveDown = squareLetter + (squareNumber - 1);
	const newMoveLeft = lettersArray[squareLetterIndex - 1] + squareNumber;
	const newMoveRight = lettersArray[squareLetterIndex + 1] + squareNumber;
	const newMoveUpRight = lettersArray[squareLetterIndex + 1] + (squareNumber + 1);
	const newMoveUpLeft = lettersArray[squareLetterIndex - 1] + (squareNumber + 1);
	const newMoveDownRight = lettersArray[squareLetterIndex + 1] + (squareNumber - 1);
	const newMoveDownLeft = lettersArray[squareLetterIndex - 1] + (squareNumber - 1);


	if (this.checkPossibleMove(newMoveUp)) {										// Generate upward movements.
		possibleMoves.push(newMoveUp);
	}

	if (this.checkPossibleMove(newMoveDown)) {										// Generate downward movements.
		possibleMoves.push(newMoveDown);
	}

	if (this.checkPossibleMove(newMoveLeft)) {										// Generates movements to the left.
		possibleMoves.push(newMoveLeft);
	}

	if (this.checkPossibleMove(newMoveRight)) {										// Generates movements to the right.
		possibleMoves.push(newMoveRight);
	}

	if (this.checkPossibleMove(newMoveUpRight)) {									// Generates diagonal movements (top right).
		possibleMoves.push(newMoveUpRight);
	}

	if (this.checkPossibleMove(newMoveUpLeft)) {									// Generates diagonal movements (top left).
		possibleMoves.push(newMoveUpLeft);
	}

	if (this.checkPossibleMove(newMoveDownRight)) {									// Generates diagonal movements (down right).
		possibleMoves.push(newMoveDownRight);
	}

	if (this.checkPossibleMove(newMoveDownLeft)) {									// Generates diagonal movements (down left).
		possibleMoves.push(newMoveDownLeft);
	}

	// This block calculates castling movement.


	this.possibleMoves = possibleMoves;
}

function movePiece ( this: King, targetSquare: string ) {
	this.square = targetSquare;
	this.hasMove = true;

	piecesData.pieces.map( (element) => {		
		if (element.player !== this.player && element.square === targetSquare) {
			element.die();
		}
	});

	this.animateMove(targetSquare);
}