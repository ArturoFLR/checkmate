import { piecesData } from "../globals/gameData";
import Piece from "./Piece";

class Rook extends Piece {
	constructor( id: string, player: "b" | "w", image: string, square: string, public hasMove: boolean ){
		super(id, player, image, square);
	}

	calcPossibleMoves = calcPossibleMoves;
	movePiece = movePiece;
}

export default Rook;

function calcPossibleMoves  ( this: Rook ) {
	const squareLetter = this.square[0];
	const squareNumber = Number(this.square[1]);
	const lettersArray = ["x", "x", "x", "x", "x", "x", "x","x", "a", "b", "c", "d", "e", "f", "g", "h", "x", "x", "x", "x", "x", "x", "x","x"];		// If a new move goes off the board, "checkPossibleMove" will know because the letter in the square will be "x".
	const squareLetterIndex = lettersArray.findIndex( (element ) => element === squareLetter);		// Saves the index of lettersArray in which the letter of the current square is located.

	const possibleMoves: string[] = [];										// Stores the list of possible moves.
					
	let counter = 1;														// Used to iterate over all possible squares.

	let cantMoveUp = false;
	let cantMoveDown = false;
	let cantMoveLeft = false;
	let cantMoveRight = false;


	while (counter < 8) {
		const newMoveUp = squareLetter + (squareNumber + counter);							// These variables store a new possible move, which will be checked before adding it to "possibleMoves".
		const newMoveDown = squareLetter + (squareNumber - counter);
		const newMoveLeft = lettersArray[squareLetterIndex - counter] + squareNumber;
		const newMoveRight = lettersArray[squareLetterIndex + counter] + squareNumber;

		if (this.checkPossibleMove(newMoveUp) && cantMoveUp === false) {					// Generate upward movements.
			const targetSquare = document.getElementById(newMoveUp) as HTMLDivElement;

			if (targetSquare.firstElementChild) {											// If there is an enemy piece on the destination square, it is a valid square, but we cannot continue moving in that direction (the piece would jump over the enemy pieces).
				cantMoveUp = true;
			}

			possibleMoves.push(newMoveUp);
		} else {																			// If the "checkPossibleMove" check is not passed, we cannot continue moving in that direction.
			cantMoveUp = true;
		}

		if (this.checkPossibleMove(newMoveDown) && cantMoveDown === false) {				// Generate downward movements.
			const targetSquare = document.getElementById(newMoveDown) as HTMLDivElement;

			if (targetSquare.firstElementChild) {
				cantMoveDown = true;
			}

			possibleMoves.push(newMoveDown);
		} else {
			cantMoveDown = true;
		}

		if (this.checkPossibleMove(newMoveLeft) && cantMoveLeft === false) {				// Generates movements to the left.
			const targetSquare = document.getElementById(newMoveLeft) as HTMLDivElement;

			if (targetSquare.firstElementChild) {
				cantMoveLeft = true;
			}

			possibleMoves.push(newMoveLeft);
		} else {
			cantMoveLeft = true;
		}

		if (this.checkPossibleMove(newMoveRight) && cantMoveRight === false) {				// Generates movements to the right.
			const targetSquare = document.getElementById(newMoveRight) as HTMLDivElement;

			if (targetSquare.firstElementChild) {
				cantMoveRight = true;
			}

			possibleMoves.push(newMoveRight);
		} else {
			cantMoveRight = true;
		}

		counter++;
	}
	
	this.possibleMoves = possibleMoves;
}

function movePiece ( this: Rook, targetSquare: string ) {

	this.square = targetSquare;
	this.hasMove = true;

	piecesData.pieces.map( (element) => {		
		if (element.player !== this.player && element.square === targetSquare) {
			element.die();
		}
	});

	this.animateMove(targetSquare);
}