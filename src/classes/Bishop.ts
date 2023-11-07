import { piecesData } from "../globals/gameData";
import Piece from "./Piece";

class Bishop extends Piece {
	constructor( id: string, player: "b" | "w", image: string, square: string ){
		super(id, player, image, square);
	}

	calcPossibleMoves = calcPossibleMoves;
	movePiece = movePiece;
}

export default Bishop;

function calcPossibleMoves  ( this: Bishop ) {
	const squareLetter = this.square[0];
	const squareNumber = Number(this.square[1]);
	const lettersArray = ["x", "x", "x", "x", "x", "x", "x","x", "a", "b", "c", "d", "e", "f", "g", "h", "x", "x", "x", "x", "x", "x", "x","x"];		// If a new move goes off the board, "checkPossibleMove" will know because the letter in the square will be "x".
	const squareLetterIndex = lettersArray.findIndex( (element ) => element === squareLetter);		// Saves the index of lettersArray in which the letter of the current square is located.

	const possibleMoves: string[] = [];										// Stores the list of possible moves.
	const impossibleMovesForKings: string[] = [];							// It saves moves which cannot be made now because there is a friendly piece in the square, but would affect the king if it moves to those possible capture squares.					
	let counter = 1;														// Used to iterate over all possible squares.

	let cantMoveUpLeft = false;
	let cantMoveUpRight = false;
	let cantMoveDownLeft = false;
	let cantMoveDownRight = false;


	while (counter < 8) {
		const newMoveUpLeft = lettersArray[squareLetterIndex - counter] + (squareNumber + counter);							// These variables store a new possible move, which will be checked before adding it to "possibleMoves".
		const newMoveUpRight = lettersArray[squareLetterIndex + counter] + (squareNumber + counter);
		const newMoveDownLeft = lettersArray[squareLetterIndex - counter] + (squareNumber - counter);
		const newMoveDownRight = lettersArray[squareLetterIndex + counter] + (squareNumber - counter);


		if (this.checkPossibleMove(newMoveUpLeft) && cantMoveUpLeft === false) {					// Generate up - left movements.
			const targetSquare = document.getElementById(newMoveUpLeft) as HTMLDivElement;

			if (targetSquare.firstElementChild) {											// If there is an enemy piece on the destination square, it is a valid square, but we cannot continue moving in that direction (the piece would jump over the enemy pieces).
				cantMoveUpLeft = true;

				const piece = targetSquare.firstElementChild as HTMLImageElement;

				if (piece.id === "K" || piece.id === "k") {														// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = lettersArray[squareLetterIndex - counter - 1] + (squareNumber + counter + 1);
					
					if (this.checkPossibleMove(newImpossibleMoveForKings)) {
						const square = document.getElementById(newImpossibleMoveForKings);

						if (square?.firstElementChild) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the box is empty, we must add it to "impossibleMovesForKings"
						}
					} else {
						const square = document.getElementById(newImpossibleMoveForKings);

						if (square) {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square exists on the board, it will have been rejected by "checkPossibleMove" for containing a friendly piece that the king can capture and be in check, so we add it to "impossibleMovesForKings"
						}
					}

				}
			}

			possibleMoves.push(newMoveUpLeft);
		} else if (cantMoveUpLeft === false) {																			
			cantMoveUpLeft = true;																// If the "checkPossibleMove" check is not passed, we cannot continue moving in that direction.

			const targetSquare = document.getElementById(newMoveUpLeft);						// Now it´s going to Check if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		
			if (targetSquare) {
				const pieceInTargetSquare = targetSquare.firstElementChild;

				if (pieceInTargetSquare) {
					impossibleMovesForKings.push(newMoveUpLeft);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
				}
			}
		}



		if (this.checkPossibleMove(newMoveUpRight) && cantMoveUpRight === false) {					// Generate up - right movements.
			const targetSquare = document.getElementById(newMoveUpRight) as HTMLDivElement;

			if (targetSquare.firstElementChild) {											// If there is an enemy piece on the destination square, it is a valid square, but we cannot continue moving in that direction (the piece would jump over the enemy pieces).
				cantMoveUpRight = true;

				const piece = targetSquare.firstElementChild as HTMLImageElement;

				if (piece.id === "K" || piece.id === "k") {														// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = lettersArray[squareLetterIndex + counter + 1] + (squareNumber + counter + 1);
					
					if (this.checkPossibleMove(newImpossibleMoveForKings)) {
						const square = document.getElementById(newImpossibleMoveForKings);

						if (square?.firstElementChild) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the box is empty, we must add it to "impossibleMovesForKings"
						}
					} else {
						const square = document.getElementById(newImpossibleMoveForKings);

						if (square) {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square exists on the board, it will have been rejected by "checkPossibleMove" for containing a friendly piece that the king can capture and be in check, so we add it to "impossibleMovesForKings"
						}
					}

				}
			}

			possibleMoves.push(newMoveUpRight);
		} else  if (cantMoveUpRight === false) {																			
			cantMoveUpRight = true;																// If the "checkPossibleMove" check is not passed, we cannot continue moving in that direction.

			const targetSquare = document.getElementById(newMoveUpRight);						// Now it´s going to Check if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		
			if (targetSquare) {
				const pieceInTargetSquare = targetSquare.firstElementChild;

				if (pieceInTargetSquare) {
					impossibleMovesForKings.push(newMoveUpRight);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
				}
			}
		}



		if (this.checkPossibleMove(newMoveDownLeft) && cantMoveDownLeft === false) {					// Generate downward - left movements.
			const targetSquare = document.getElementById(newMoveDownLeft) as HTMLDivElement;

			if (targetSquare.firstElementChild) {											// If there is an enemy piece on the destination square, it is a valid square, but we cannot continue moving in that direction (the piece would jump over the enemy pieces).
				cantMoveDownLeft = true;

				const piece = targetSquare.firstElementChild as HTMLImageElement;

				if (piece.id === "K" || piece.id === "k") {														// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = lettersArray[squareLetterIndex - counter - 1] + (squareNumber - counter - 1);
					
					if (this.checkPossibleMove(newImpossibleMoveForKings)) {
						const square = document.getElementById(newImpossibleMoveForKings);

						if (square?.firstElementChild) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the box is empty, we must add it to "impossibleMovesForKings"
						}
					} else {
						const square = document.getElementById(newImpossibleMoveForKings);

						if (square) {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square exists on the board, it will have been rejected by "checkPossibleMove" for containing a friendly piece that the king can capture and be in check, so we add it to "impossibleMovesForKings"
						}
					}

				}
			}

			possibleMoves.push(newMoveDownLeft);
		} else if (cantMoveDownLeft === false) {																			
			cantMoveDownLeft = true;																// If the "checkPossibleMove" check is not passed, we cannot continue moving in that direction.

			const targetSquare = document.getElementById(newMoveDownLeft);						// Now it´s going to Check if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		
			if (targetSquare) {
				const pieceInTargetSquare = targetSquare.firstElementChild;

				if (pieceInTargetSquare) {
					impossibleMovesForKings.push(newMoveDownLeft);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
				}
			}
		}



		if (this.checkPossibleMove(newMoveDownRight) && cantMoveDownRight === false) {					// Generate downward - right movements.
			const targetSquare = document.getElementById(newMoveDownRight) as HTMLDivElement;

			if (targetSquare.firstElementChild) {											// If there is an enemy piece on the destination square, it is a valid square, but we cannot continue moving in that direction (the piece would jump over the enemy pieces).
				cantMoveDownRight = true;

				const piece = targetSquare.firstElementChild as HTMLImageElement;

				if (piece.id === "K" || piece.id === "k") {														// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = lettersArray[squareLetterIndex + counter + 1] + (squareNumber - counter - 1);
					
					if (this.checkPossibleMove(newImpossibleMoveForKings)) {
						const square = document.getElementById(newImpossibleMoveForKings);

						if (square?.firstElementChild) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the box is empty, we must add it to "impossibleMovesForKings"
						}
					} else {
						const square = document.getElementById(newImpossibleMoveForKings);

						if (square) {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square exists on the board, it will have been rejected by "checkPossibleMove" for containing a friendly piece that the king can capture and be in check, so we add it to "impossibleMovesForKings"
						}
					}

				}
			}

			possibleMoves.push(newMoveDownRight);
		} else if (cantMoveDownRight === false) {																			
			cantMoveDownRight = true;																// If the "checkPossibleMove" check is not passed, we cannot continue moving in that direction.

			const targetSquare = document.getElementById(newMoveDownRight);						// Now it´s going to Check if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		
			if (targetSquare) {
				const pieceInTargetSquare = targetSquare.firstElementChild;

				if (pieceInTargetSquare) {
					impossibleMovesForKings.push(newMoveDownRight);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
				}
			}
		}

		counter++;
	}

	this.possibleMoves = possibleMoves;
	this.impossibleMovesForKings = impossibleMovesForKings;
}


function movePiece ( this: Bishop, targetSquare: string ) {
	this.square = targetSquare;

	piecesData.pieces.map( (element) => {		
		if (element.player !== this.player && element.square === targetSquare) {
			element.die();
		}
	});

	this.animateMove(targetSquare);
}