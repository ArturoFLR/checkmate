import styles from "../components/Board.module.scss";
import { piecesData } from "../globals/gameData";
import Pawn from "./Pawn";
import Piece from "./Piece";

type InvalidSquareType = {
		owner: Piece,
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
}

export default King;

function calcPossibleMoves ( this: King ) {											// Calculate the possible moves, not being valid those in which the king is in check. This prevents the rest of the kings from correctly calculating their possible moves. That's why there is a second set of moves: "possibleMovesEvenWithCheck"
	const squareLetter = this.square[0];
	const squareNumber = Number(this.square[1]);
	const lettersArray = ["x", "a", "b", "c", "d", "e", "f", "g", "h", "x"];		// If a new move goes off the board, "checkPossibleMove" will know because the letter in the square will be "x".
	const squareLetterIndex = lettersArray.findIndex( (element ) => element === squareLetter);		// Saves the index of lettersArray in which the letter of the current square is located.
	let possibleMoves: string[] = [];		
	const impossibleMovesForKings: string[] = [];														// It saves moves that are not really possible because they involve a check on the king, but that must be taken into account for the moves of other kings.
	const invalidSquaresDueToCheck: InvalidSquareType[] = [];

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
	} else {																		// Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveUp);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveUp);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveDown)) {										// Generate downward movements.
		possibleMoves.push(newMoveDown);
	} else {																		// it Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveDown);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveDown);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveLeft)) {										// Generates movements to the left.
		possibleMoves.push(newMoveLeft);
	} else {																		// it Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveLeft);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveLeft);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveRight)) {										// Generates movements to the right.
		possibleMoves.push(newMoveRight);
	} else {																		// it Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveRight);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveRight);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveUpRight)) {									// Generates diagonal movements (top right).
		possibleMoves.push(newMoveUpRight);
	} else {																		// it Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveUpRight);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveUpRight);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveUpLeft)) {									// Generates diagonal movements (top left).
		possibleMoves.push(newMoveUpLeft);
	} else {																		// it Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveUpLeft);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveUpLeft);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveDownRight)) {									// Generates diagonal movements (down right).
		possibleMoves.push(newMoveDownRight);
	} else {																		// it Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveDownRight);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveDownRight);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	if (this.checkPossibleMove(newMoveDownLeft)) {									// Generates diagonal movements (down left).
		possibleMoves.push(newMoveDownLeft);
	} else {																		// it Checks if the move has been rejected because there is a piece of the same color in the square. It would not be a valid move, but we must save it because it affects the other king.
		const targetSquare = document.getElementById(newMoveDownLeft);						
		
		if (targetSquare) {
			const pieceInTargetSquare = targetSquare.firstElementChild;

			if (pieceInTargetSquare) {
				impossibleMovesForKings.push(newMoveDownLeft);								// If the piece is of the same color it is not a valid move, but it is saved because it would affect the king (check) if it captures that piece.
			}
		}
	}

	// This block calculates castling movement.

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