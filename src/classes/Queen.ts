import { piecesData } from "../globals/gameData";
import Piece from "./Piece";

class Queen extends Piece {
	constructor( id: string, player: "b" | "w", image: string, square: string ){
		super(id, player, image, square);
	}

	calcPossibleMoves = calcPossibleMoves;
	movePiece = movePiece;
}

export default Queen;

function calcPossibleMoves  ( this: Queen ) {
	const squareLetter = this.square[0];
	const squareNumber = Number(this.square[1]);
	const lettersArray = ["x", "x", "x", "x", "x", "x", "x","x", "a", "b", "c", "d", "e", "f", "g", "h", "x", "x", "x", "x", "x", "x", "x","x"];		// If a new move goes off the board, "testSquareExists" will know because the letter in the square will be "x".
	const squareLetterIndex = lettersArray.findIndex( (element ) => element === squareLetter);		// Saves the index of lettersArray in which the letter of the current square is located.

	const possibleMoves: string[] = [];										// Stores the list of possible moves.
	const impossibleMovesForKings: string[] = [];							// It saves moves which cannot be made now because there is a friendly piece in the square, but would affect the king if it moves to those possible capture squares.					
	let counter = 1;														// Used to iterate over all possible squares.

	let cantMoveUp = false;
	let cantMoveDown = false;
	let cantMoveLeft = false;
	let cantMoveRight = false;

	let cantMoveUpLeft = false;
	let cantMoveUpRight = false;
	let cantMoveDownLeft = false;
	let cantMoveDownRight = false;


	while (counter < 8) {
		const newMoveUp = squareLetter + (squareNumber + counter);							// Tower-like new moves, which will be checked before adding it to "possibleMoves".
		const newMoveDown = squareLetter + (squareNumber - counter);
		const newMoveLeft = lettersArray[squareLetterIndex - counter] + squareNumber;
		const newMoveRight = lettersArray[squareLetterIndex + counter] + squareNumber;

		const newMoveUpLeft = lettersArray[squareLetterIndex - counter] + (squareNumber + counter);							// Bishop-like new moves, which will be checked before adding it to "possibleMoves".
		const newMoveUpRight = lettersArray[squareLetterIndex + counter] + (squareNumber + counter);
		const newMoveDownLeft = lettersArray[squareLetterIndex - counter] + (squareNumber - counter);
		const newMoveDownRight = lettersArray[squareLetterIndex + counter] + (squareNumber - counter);


		if (this.testSquareExists(newMoveUp) && cantMoveUp === false ) {							// GENERATE UPWARD MOVEMENTS.

			if (this.testSquareContainsEnemyPiece(newMoveUp)) {
				cantMoveUp = true;
				possibleMoves.push(newMoveUp);

				if (this.testSquareContainsKing(newMoveUp)) {											// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = squareLetter + (squareNumber + counter + 1);
					
					if (this.testSquareExists(newImpossibleMoveForKings)) {

						if (this.testSquareContainsEnemyPiece(newImpossibleMoveForKings)) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square contains a friendly piece os an empty square, the king can move there and be in check again, so we add it to "impossibleMovesForKings"
						}
					}
				}
				
			} else if (this.testSquareContainsFriendlyPiece(newMoveUp)) {
				cantMoveUp = true;
				impossibleMovesForKings.push(newMoveUp);
			} else {
				possibleMoves.push(newMoveUp);
			}
		} else {
			cantMoveUp = true;																		// If the square does not exist, we cannot continue moving in that direction.
		}


		if (this.testSquareExists(newMoveDown) && cantMoveDown === false ) {							// GENERATE DOWNWARD MOVEMENTS.

			if (this.testSquareContainsEnemyPiece(newMoveDown)) {
				cantMoveDown = true;
				possibleMoves.push(newMoveDown);

				if (this.testSquareContainsKing(newMoveDown)) {											// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = squareLetter + (squareNumber - counter - 1);
					
					if (this.testSquareExists(newImpossibleMoveForKings)) {

						if (this.testSquareContainsEnemyPiece(newImpossibleMoveForKings)) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square contains a friendly piece os an empty square, the king can move there and be in check again, so we add it to "impossibleMovesForKings"
						}
					}
				}

			} else if (this.testSquareContainsFriendlyPiece(newMoveDown)) {
				cantMoveDown = true;
				impossibleMovesForKings.push(newMoveDown);
			} else {
				possibleMoves.push(newMoveDown);
			}
		} else {
			cantMoveDown = true;																		// If the square does not exist, we cannot continue moving in that direction.
		}


		if (this.testSquareExists(newMoveLeft) && cantMoveLeft === false ) {							// GENERATE MOVEMENTS TO THE LEFT.

			if (this.testSquareContainsEnemyPiece(newMoveLeft)) {
				cantMoveLeft = true;
				possibleMoves.push(newMoveLeft);

				if (this.testSquareContainsKing(newMoveLeft)) {											// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = lettersArray[squareLetterIndex - counter - 1] + squareNumber;
					
					if (this.testSquareExists(newImpossibleMoveForKings)) {

						if (this.testSquareContainsEnemyPiece(newImpossibleMoveForKings)) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square contains a friendly piece os an empty square, the king can move there and be in check again, so we add it to "impossibleMovesForKings"
						}
					}
				}

			} else if (this.testSquareContainsFriendlyPiece(newMoveLeft)) {
				cantMoveLeft = true;
				impossibleMovesForKings.push(newMoveLeft);
			} else {
				possibleMoves.push(newMoveLeft);
			}
		} else {
			cantMoveLeft = true;																		// If the square does not exist, we cannot continue moving in that direction.
		}


		if (this.testSquareExists(newMoveRight) && cantMoveRight === false ) {							// GENERATE MOVEMENTS TO THE RIGHT.

			if (this.testSquareContainsEnemyPiece(newMoveRight)) {
				cantMoveRight = true;
				possibleMoves.push(newMoveRight);

				if (this.testSquareContainsKing(newMoveRight)) {											// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = lettersArray[squareLetterIndex + counter + 1] + squareNumber;
					
					if (this.testSquareExists(newImpossibleMoveForKings)) {

						if (this.testSquareContainsEnemyPiece(newImpossibleMoveForKings)) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square contains a friendly piece os an empty square, the king can move there and be in check again, so we add it to "impossibleMovesForKings"
						}
					}
				}

			} else if (this.testSquareContainsFriendlyPiece(newMoveRight)) {
				cantMoveRight = true;
				impossibleMovesForKings.push(newMoveRight);
			} else {
				possibleMoves.push(newMoveRight);
			}
		} else {
			cantMoveRight = true;																		// If the square does not exist, we cannot continue moving in that direction.
		}


		if (this.testSquareExists(newMoveUpLeft) && cantMoveUpLeft === false) {					// GENERATE UP - LEFT MOVEMENTS.

			if (this.testSquareContainsEnemyPiece(newMoveUpLeft)) {
				cantMoveUpLeft = true;															// If there is an enemy piece on the destination square, it is a valid square, but we cannot continue moving in that direction (the piece would jump over the enemy pieces).
				possibleMoves.push(newMoveUpLeft);

				if (this.testSquareContainsKing(newMoveUpLeft)) {											// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = lettersArray[squareLetterIndex - counter - 1] + (squareNumber + counter + 1);
					
					if (this.testSquareExists(newImpossibleMoveForKings)) {

						if (this.testSquareContainsEnemyPiece(newImpossibleMoveForKings)) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square contains a friendly piece os an empty square, the king can move there and be in check again, so we add it to "impossibleMovesForKings"
						}
					}
				}

			} else if (this.testSquareContainsFriendlyPiece(newMoveUpLeft)) {
				cantMoveUpLeft = true;
				impossibleMovesForKings.push(newMoveUpLeft);
			} else {
				possibleMoves.push(newMoveUpLeft);
			}
		} else {
			cantMoveUpLeft = true;																		// If the square does not exist, we cannot continue moving in that direction.
		}



		if (this.testSquareExists(newMoveUpRight) && cantMoveUpRight === false) {					// GENERATE UP - RIGHT MOVEMENTS.

			if (this.testSquareContainsEnemyPiece(newMoveUpRight)) {
				cantMoveUpRight = true;															// If there is an enemy piece on the destination square, it is a valid square, but we cannot continue moving in that direction (the piece would jump over the enemy pieces).
				possibleMoves.push(newMoveUpRight);

				if (this.testSquareContainsKing(newMoveUpRight)) {											// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = lettersArray[squareLetterIndex + counter + 1] + (squareNumber + counter + 1);
					
					if (this.testSquareExists(newImpossibleMoveForKings)) {

						if (this.testSquareContainsEnemyPiece(newImpossibleMoveForKings)) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square contains a friendly piece os an empty square, the king can move there and be in check again, so we add it to "impossibleMovesForKings"
						}
					}
				}

			} else if (this.testSquareContainsFriendlyPiece(newMoveUpRight)) {
				cantMoveUpRight = true;
				impossibleMovesForKings.push(newMoveUpRight);
			} else {
				possibleMoves.push(newMoveUpRight);
			}
		} else {
			cantMoveUpRight = true;																		// If the square does not exist, we cannot continue moving in that direction.
		}



		if (this.testSquareExists(newMoveDownLeft) && cantMoveDownLeft === false) {					// GENERATE DOWN - LEFT MOVEMENTS.

			if (this.testSquareContainsEnemyPiece(newMoveDownLeft)) {
				cantMoveDownLeft = true;															// If there is an enemy piece on the destination square, it is a valid square, but we cannot continue moving in that direction (the piece would jump over the enemy pieces).
				possibleMoves.push(newMoveDownLeft);

				if (this.testSquareContainsKing(newMoveDownLeft)) {											// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = lettersArray[squareLetterIndex - counter - 1] + (squareNumber - counter - 1);
					
					if (this.testSquareExists(newImpossibleMoveForKings)) {

						if (this.testSquareContainsEnemyPiece(newImpossibleMoveForKings)) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square contains a friendly piece os an empty square, the king can move there and be in check again, so we add it to "impossibleMovesForKings"
						}
					}
				}

			} else if (this.testSquareContainsFriendlyPiece(newMoveDownLeft)) {
				cantMoveDownLeft = true;
				impossibleMovesForKings.push(newMoveDownLeft);
			} else {
				possibleMoves.push(newMoveDownLeft);
			}
		} else {
			cantMoveDownLeft = true;																		// If the square does not exist, we cannot continue moving in that direction.
		}



		if (this.testSquareExists(newMoveDownRight) && cantMoveDownRight === false) {					// GENERATE DOWN - RIGHT MOVEMENTS.

			if (this.testSquareContainsEnemyPiece(newMoveDownRight)) {
				cantMoveDownRight = true;															// If there is an enemy piece on the destination square, it is a valid square, but we cannot continue moving in that direction (the piece would jump over the enemy pieces).
				possibleMoves.push(newMoveDownRight);

				if (this.testSquareContainsKing(newMoveDownRight)) {											// If the enemy piece is a king, we check the square behind the king (+1 to the current move). If it is empty or has a piece of our color (that the king could capture) it must be added to the list of impossible moves for the king, since we would continue to check it.
					const newImpossibleMoveForKings = lettersArray[squareLetterIndex + counter + 1] + (squareNumber - counter - 1);
					
					if (this.testSquareExists(newImpossibleMoveForKings)) {

						if (this.testSquareContainsEnemyPiece(newImpossibleMoveForKings)) {
							null;																		// If the square contains an enemy piece, it does not have to be taken into account, since it will be the same color as the king and he will not be able to move there.
						} else {
							impossibleMovesForKings.push(newImpossibleMoveForKings);					// If the square contains a friendly piece os an empty square, the king can move there and be in check again, so we add it to "impossibleMovesForKings"
						}
					}
				}

			} else if (this.testSquareContainsFriendlyPiece(newMoveDownRight)) {
				cantMoveDownRight = true;
				impossibleMovesForKings.push(newMoveDownRight);
			} else {
				possibleMoves.push(newMoveDownRight);
			}
		} else {
			cantMoveDownRight = true;																		// If the square does not exist, we cannot continue moving in that direction.
		}

		counter++;
	}
	
	this.possibleMoves = possibleMoves;
	this.impossibleMovesForKings = impossibleMovesForKings;
}



function movePiece ( this: Queen, targetSquare: string ) {
	this.square = targetSquare;

	piecesData.pieces.map( (element) => {		
		if (element.player !== this.player && element.square === targetSquare) {
			element.die();
		}
	});

	this.animateMove(targetSquare);
}