import styles from "../components/Board.module.scss";
import { piecesData } from "../globals/gameData";
import Pawn from "./Pawn";
import Piece from "./Piece";
import { PiecesType } from "./PiecesType";

type InvalidSquareType = {
		owner: PiecesType,
		square: string
};

class King extends Piece {
	isCheck: boolean = false;
	isShortCastlingPossible = true;										// This value is set to "false" by the king's "move" method and by the right rook's "move" method. Just because it is "true" does not mean that the king can castle this turn (there may be pieces or a possible check along the way).
	isLongCastlingPossible = true;										// This value is set to "false" by the king's "move" method and by the left rook's "move" method.Just because it is "true" does not mean that the king can castle this turn (there may be pieces or a possible check along the way).
	invalidSquaresDueToCheck: InvalidSquareType[] = [];					// This saves invalid squares as a target because they cause a check. It is used by "Board" to give styles and animations to them and the pieces that have generated them.
	constructor( id: string, player: "b" | "w", image: string, square: string ){
		super(id, player, image, square);
	}

	calcPossibleMoves = calcPossibleMoves;
	movePiece = movePiece;
	testKingCheck = testKingCheck;
	animateKingDying = animateKingDying;
	testKingCheckNoStyles = testKingCheckNoStyles;
}

export let kingDyingExplosionTimeout: number;
export default King;

function calcPossibleMoves ( this: King ) {											// Calculate the possible moves, not being valid those in which the king is in check. This prevents the rest of the kings from correctly calculating their possible moves. That's why there is a second set of moves: "possibleMovesEvenWithCheck"
	const squareLetter = this.square[0];
	const squareNumber = Number(this.square[1]);
	const lettersArray = ["x", "a", "b", "c", "d", "e", "f", "g", "h", "x"];		// If a new move goes off the board, "testSquareExists" will know because the letter in the square will be "x".
	const squareLetterIndex = lettersArray.findIndex( (element ) => element === squareLetter);		// Saves the index of lettersArray in which the letter of the current square is located.
	let possibleMoves: string[] = [];		
	const impossibleMovesForKings: string[] = [];														// It saves moves that are not really possible because they involve a check on the king, but that must be taken into account for the moves of other kings.
	const invalidSquaresDueToCheck: InvalidSquareType[] = [];

	// This block calculates normal movement (not castling).

	const newMoveUp = squareLetter + (squareNumber + 1);							// These variables store a new possible move, which will be checked before adding it to "possibleMoves".
	const newMoveDown = squareLetter + (squareNumber - 1);
	const newMoveLeft = lettersArray[squareLetterIndex - 1] + squareNumber;
	const newMoveRight = lettersArray[squareLetterIndex + 1] + squareNumber;
	const newMoveUpRight = lettersArray[squareLetterIndex + 1] + (squareNumber + 1);
	const newMoveUpLeft = lettersArray[squareLetterIndex - 1] + (squareNumber + 1);
	const newMoveDownRight = lettersArray[squareLetterIndex + 1] + (squareNumber - 1);
	const newMoveDownLeft = lettersArray[squareLetterIndex - 1] + (squareNumber - 1);


	if (this.testSquareExists(newMoveUp)) {											// UPWARD MOVEMENT.
		if (this.testSquareContainsFriendlyPiece(newMoveUp)) {						// If the square contains a friendly piece  it´s not a valid move, but it is saved because it would affect the other king (check) if it captures that piece.
			impossibleMovesForKings.push(newMoveUp);
		} else {																	// If the square is empty or contains an enemy piece it´s a valid move.
			possibleMoves.push(newMoveUp);
		}
	}


	if (this.testSquareExists(newMoveDown)) {											// DOWNWARD MOVEMENT.
		if (this.testSquareContainsFriendlyPiece(newMoveDown)) {						// If the square contains a friendly piece  it´s not a valid move, but it is saved because it would affect the other king (check) if it captures that piece.
			impossibleMovesForKings.push(newMoveDown);
		} else {																	// If the square is empty or contains an enemy piece it´s a valid move.
			possibleMoves.push(newMoveDown);
		}
	}


	if (this.testSquareExists(newMoveLeft)) {											// TO THE LEFT MOVEMENT.
		if (this.testSquareContainsFriendlyPiece(newMoveLeft)) {						// If the square contains a friendly piece  it´s not a valid move, but it is saved because it would affect the other king (check) if it captures that piece.
			impossibleMovesForKings.push(newMoveLeft);
		} else {																	// If the square is empty or contains an enemy piece it´s a valid move.
			possibleMoves.push(newMoveLeft);
		}
	}


	if (this.testSquareExists(newMoveRight)) {											// TO THE RIGHT MOVEMENT.
		if (this.testSquareContainsFriendlyPiece(newMoveRight)) {						// If the square contains a friendly piece  it´s not a valid move, but it is saved because it would affect the other king (check) if it captures that piece.
			impossibleMovesForKings.push(newMoveRight);
		} else {																	// If the square is empty or contains an enemy piece it´s a valid move.
			possibleMoves.push(newMoveRight);
		}
	}


	if (this.testSquareExists(newMoveUpRight)) {											// UP - RIGHT MOVEMENT.
		if (this.testSquareContainsFriendlyPiece(newMoveUpRight)) {						// If the square contains a friendly piece  it´s not a valid move, but it is saved because it would affect the other king (check) if it captures that piece.
			impossibleMovesForKings.push(newMoveUpRight);
		} else {																	// If the square is empty or contains an enemy piece it´s a valid move.
			possibleMoves.push(newMoveUpRight);
		}
	}


	if (this.testSquareExists(newMoveUpLeft)) {											// UP - LEFT MOVEMENT.
		if (this.testSquareContainsFriendlyPiece(newMoveUpLeft)) {						// If the square contains a friendly piece  it´s not a valid move, but it is saved because it would affect the other king (check) if it captures that piece.
			impossibleMovesForKings.push(newMoveUpLeft);
		} else {																	// If the square is empty or contains an enemy piece it´s a valid move.
			possibleMoves.push(newMoveUpLeft);
		}
	}


	if (this.testSquareExists(newMoveDownRight)) {											// DOWN - RIGHT MOVEMENT.
		if (this.testSquareContainsFriendlyPiece(newMoveDownRight)) {						// If the square contains a friendly piece  it´s not a valid move, but it is saved because it would affect the other king (check) if it captures that piece.
			impossibleMovesForKings.push(newMoveDownRight);
		} else {																	// If the square is empty or contains an enemy piece it´s a valid move.
			possibleMoves.push(newMoveDownRight);
		}
	}


	if (this.testSquareExists(newMoveDownLeft)) {											// DOWN - LEFT MOVEMENT.
		if (this.testSquareContainsFriendlyPiece(newMoveDownLeft)) {						// If the square contains a friendly piece  it´s not a valid move, but it is saved because it would affect the other king (check) if it captures that piece.
			impossibleMovesForKings.push(newMoveDownLeft);
		} else {																	// If the square is empty or contains an enemy piece it´s a valid move.
			possibleMoves.push(newMoveDownLeft);
		}
	}



	// This block calculates CASTLING MOVEMENT.

	if (this.isShortCastlingPossible) {									// Check if a short castling is possible.
		let canCastle = true;

		piecesData.pieces.map( (element) => {										
			if ((element.square === "f1" || element.square === "g1") && this.player === "w") {		// Check if there are any pieces in the middle squares.
				canCastle = false;
			} else if ((element.square === "f8" || element.square === "g8") && this.player === "b") {
				canCastle = false;
			}

			if (element.player !== this.player && canCastle === true) {									// Check if there is an intermediate square where the king can be checked by enemy pieces.
				element.possibleMoves.map( (move) => {
					if ((move === "f1" || move === "g1") && this.player === "w") {
						canCastle = false;
						invalidSquaresDueToCheck.push({owner: element, square: move});
					} else if ((move === "f8" || move === "g8") && this.player === "b") {
						canCastle = false;
						invalidSquaresDueToCheck.push({owner: element, square: move});
					}
				});

				element.impossibleMovesForKings.map( (move) => {
					if ((move === "f1" || move === "g1") && this.player === "w") {
						canCastle = false;
					} else if ((move === "f8" || move === "g8") && this.player === "b") {
						canCastle = false;
					}
				});
			}
		});

		if (canCastle === true) {												// If the previous 2 checks are passed, a short castling is possible and the corresponding square is added as a possible objective.
			if (this.player === "w"){
				possibleMoves.push("g1");
			} else {
				possibleMoves.push("g8");
			}												
		}
	}


	if (this.isLongCastlingPossible) {									// Check if a long castling is possible.
		let canCastle = true;

		piecesData.pieces.map( (element) => {										
			if ((element.square === "b1" || element.square === "c1" || element.square === "d1") && this.player === "w") {		// Check if there are any pieces in the middle squares.
				canCastle = false;
			} else if ((element.square === "b8" || element.square === "c8" || element.square === "d8") && this.player === "b") {
				canCastle = false;
			}

			if (element.player !== this.player && canCastle === true) {									// Check if there is an intermediate square where the king can be checked by enemy pieces.
				element.possibleMoves.map( (move) => {
					if ((move === "c1" || move === "d1") && this.player === "w") {
						canCastle = false;
						invalidSquaresDueToCheck.push({owner: element, square: move});
					} else if ((move === "c8" || move === "d8") && this.player === "b") {
						canCastle = false;
						invalidSquaresDueToCheck.push({owner: element, square: move});
					}
				});

				element.impossibleMovesForKings.map( (move) => {
					if ((move === "c1" || move === "d1") && this.player === "w") {
						canCastle = false;
					} else if ((move === "c8" || move === "d8") && this.player === "b") {
						canCastle = false;
					}
				});
			}
		});

		if (canCastle === true) {												// If the previous 2 checks are passed, a long castling is possible and the corresponding square is added as a possible objective.
			if (this.player === "w"){
				possibleMoves.push("c1");
			} else {
				possibleMoves.push("c8");
			}												
		}
	}

	// Eliminates moves in which the king is in check, checking the "possibleMovesForKings" property of the enemy pieces, but saves these impossible moves because they affect the calculation of possible moves of the enemy king

	const possibleMovesWithoutCheks: string[] = [];
	let isValidNewPossibleMove = true;

	possibleMoves.map( (move) => {												// For each possible move of this king, it will be checked that it does not appear in the "possibleMoves" and "impossibleMovesForKings" properties of the enemy pieces. If so, it would be a check and is not a valid move.
		piecesData.pieces.map( (piece) => {
			if (piece.player !== this.player) {
				piece.possibleMoves.map( (validMove) => {
					if (move === validMove) {
						isValidNewPossibleMove = false;

						if (piece.id[0] === "P" || piece.id[0] === "p") {							// If the piece is a pawn, we need to check if the move is in the pawn property "possibleMovesForKings". If so, it is a straight line move with which the pawn cannot capture and the king is safe; It's a valid move.
							(piece as Pawn).possibleMovesForKings.map( (pawnMove) => {
								if (pawnMove === move) {
									isValidNewPossibleMove = true;

									piecesData.pieces.map( (otherEnemyPiece) => {						// Although the movement is in the "possibleMovesForKings" array, we must check that it does not appear in the "possibleMoves" and "impossibleMovesForKings" arrays of the rest of the enemy pieces. If we don't do this, a square where an enemy bishop can move (for example) can be marked as safe by a pawn.
										if (otherEnemyPiece.id !== piece.id && otherEnemyPiece.player !== this.player) {
											
											otherEnemyPiece.possibleMoves.map( (otherEnemyPieceMove) => {
												if (otherEnemyPieceMove === move) {
													isValidNewPossibleMove = false;
												}
											});

											otherEnemyPiece.impossibleMovesForKings.map( (otherEnemyPieceMove) => {
												if (otherEnemyPieceMove === move) {
													isValidNewPossibleMove = false;
												}
											});
										}
									});
								}
							});
						}

						if ( isValidNewPossibleMove === false ) invalidSquaresDueToCheck.push({"owner": piece, "square": move});			// Even if it is not a valid move, we save it so that "Board" can mark it and animate it so that the player knows why it is not.
					}
				});
				piece.impossibleMovesForKings.map( (moveForKing) => {
					if (move === moveForKing) {
						isValidNewPossibleMove = false;
						invalidSquaresDueToCheck.push({"owner": piece, "square": move});													// Even if it is not a valid move, we save it so that "Board" can mark it and animate it so that the player knows why it is not.
					}
				});
			}
		});

		if (isValidNewPossibleMove === true) {
			possibleMovesWithoutCheks.push(move);
		} else {
			impossibleMovesForKings.push(move);								// Although it is not a valid move, it is saved because it affects the possible moves of the enemy king.
		}

		isValidNewPossibleMove = true;
	});

	possibleMoves = possibleMovesWithoutCheks;								// Remove moves that involve a check from the list of possible moves.

	this.possibleMoves = possibleMoves;
	this.impossibleMovesForKings = impossibleMovesForKings;
	this.invalidSquaresDueToCheck = invalidSquaresDueToCheck;
}



function movePiece ( this: King, targetSquare: string ) {
	if (this.isCheck === true) {
		const checkedKingSquare = document.getElementById(this.square) as HTMLDivElement;
		checkedKingSquare.classList.remove(styles.checked);
	}

	this.square = targetSquare;

	piecesData.pieces.map( (element) => {		
		if (element.player !== this.player && element.square === targetSquare) {
			element.die();
		}
	});

	if (this.player === "w" && targetSquare === "g1" && this.isShortCastlingPossible) {					// Short castling of the White king.
		piecesData.pieces.map( (element) => {
			if (element.id === "R2") {
				element.square = "f1";
				element.animateMove("f1");
			}
		});
	}

	if (this.player === "w" && targetSquare === "c1" && this.isLongCastlingPossible) {					// Long castling of the White king.
		piecesData.pieces.map( (element) => {
			if (element.id === "R1") {
				element.square = "d1";
				element.animateMove("d1");
			}
		});
	}

	if (this.player === "b" && targetSquare === "g8" && this.isShortCastlingPossible) {					// Short castling of the Black king.
		piecesData.pieces.map( (element) => {
			if (element.id === "r2") {
				element.square = "f8";
				element.animateMove("f8");
			}
		});
	}

	if (this.player === "b" && targetSquare === "c8" && this.isLongCastlingPossible) {					// Long castling of the Black king.
		piecesData.pieces.map( (element) => {
			if (element.id === "r1") {
				element.square = "d8";
				element.animateMove("d8");
			}
		});
	}

	this.isLongCastlingPossible = false;								// If the king moves, he loses the ability to castle in any direction.
	this.isShortCastlingPossible = false;
	
	this.animateMove(targetSquare);
}

function testKingCheck ( this: King ): void {												// Check if the king is in check. If so, set "isCheck" to true and modify the styles of the square (not the piece).
	const kingSquare = document.getElementById(this.square) as HTMLDivElement;
	this.isCheck = false;

	piecesData.pieces.map( (piece) => {
		if (piece.player !== this.player) {
			piece.possibleMoves.map( (move) => {
				if (move === this.square) {
					this.isCheck = true;
				}
			});
		}
	});

	if (this.isCheck) {											// This method assigns styles at the end of a turn (in case there is no next turn and this is the final view), but these are lost at the beginning of a new turn with the re-render. To avoid this, also apply this className in the "generateSquares" function
		kingSquare.classList.add(styles.checked);

	} else {
		kingSquare.classList.remove(styles.checked);
	}
}

function testKingCheckNoStyles ( this: King ): void {												// Used to know if the king is in check in checks made by the "Board" component before the end of a turn when playing against the AI. It does not apply styles to check, since they are checks on hypothetical moves.
	this.isCheck = false;

	piecesData.pieces.map( (piece) => {
		if (piece.player !== this.player) {
			piece.possibleMoves.map( (move) => {
				if (move === this.square) {
					this.isCheck = true;
				}
			});
		}
	});
}

function animateKingDying (this: King ): void {											// A special death animation for cases where the opponent does not manually capture the king and is still considered to have won. For example, when the player is in check and has no possible moves to get him out of check. (checkmate).
	const kingElement = document.getElementById(this.id) as HTMLImageElement;			// The king whose death we are going to animate.
	const explosionImg = document.createElement("img");									// Create an image of the a explosion, used in the animation.
	const square = document.getElementById(this.square) as HTMLDivElement;				// The square where we are going to add the old pawn.
	let piecesCopy: PiecesType[] = [];	

	explosionImg.src = "images/otheranims/explosion2.gif";								// We create the necessary attributes for the "explosionImg" element
	explosionImg.alt = "";
	explosionImg.className = styles.explosion;
	explosionImg.id = "explosionAnim";


	kingDyingExplosionTimeout = setTimeout( () => {
		square.classList.remove(styles.checked);
		kingElement.classList.add(styles.kingDying);
	}, 1000);

	kingDyingExplosionTimeout = setTimeout( () => {
		square.appendChild(explosionImg);
	}, 5000);

	kingDyingExplosionTimeout = setTimeout( () => {
		square.classList.add(styles.withHole);
	}, 5400);

	kingDyingExplosionTimeout = setTimeout( () => {
		explosionImg.remove();
	}, 5930);

	// Deletes the King object so that it doesn't appear again on the next render (when "GameResults" appears).

	piecesData.pieces.map( (element) => {
		if (element.id !== this.id) {
			piecesCopy = [...piecesCopy, element];
		}
	});

	piecesData.setPieces(piecesCopy);
}