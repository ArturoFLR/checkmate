import styles from "../components/Board.module.scss";
import { completeTurnData, enPassantTargetData, halfTurnData, lastPawnMovedData, piecesData, transformedPieceToAnimateData } from "../globals/gameData";
import Piece from "./Piece";
import Rook from "./Rook";

class Pawn extends Piece {
	public isFirstMove = true;
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
	const lettersArray = ["x", "a", "b", "c", "d", "e", "f", "g", "h", "x"];		// If a new move goes off the board, "checkPossibleMove" will know because the letter in the square will be "x".
	const squareLetterIndex = lettersArray.findIndex( (element ) => element === squareLetter);		// Saves the index of lettersArray in which the letter of the current square is located.
	let isOneSquareMovementPossible = false;

	const possibleMoves: string[] = [];										// Save the list of possible moves.
	let newMove: string = "";												// Saves a new possible move, which will be checked before adding it to "possibleMoves".


	// Move one square forward. The white pieces advance in the opposite way to the black pieces.

	if (this.player === "w") {												
		newMove = squareLetter + (squareNumber + 1);							
	} else {
		newMove = squareLetter + (squareNumber - 1);
	}

	if (this.checkPossibleMove(newMove)) {															// If the move is possible, check that there is not already a piece in that square (checkPossibleMove only checks if there are pieces of its own color, not the opposite, and a pawn cannot capture from the front)
		const targetSquare = document.getElementById(newMove) as HTMLDivElement;

		if (!targetSquare.firstElementChild) {
			possibleMoves.push(newMove);
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

		if (this.checkPossibleMove(newMove)) {														// If the move is possible, check that there is not already a piece in that square (checkPossibleMove only checks if there are pieces of its own color, not the opposite, and a pawn cannot capture from the front)
			const targetSquare = document.getElementById(newMove) as HTMLDivElement;

			if (!targetSquare.firstElementChild) {
				possibleMoves.push(newMove);
				isOneSquareMovementPossible = true;
			}
		}
	}

	// Capture an opponent by moving one square up(w) / down(b) and one to the left.

	if (this.player === "w") {													
		newMove = lettersArray[squareLetterIndex - 1] + (squareNumber + 1);						
	} else {
		newMove = lettersArray[squareLetterIndex - 1] + (squareNumber - 1);
	}
	
	if (this.checkPossibleMove(newMove)) {												// If the square exists, check if there is a piece in it.
		const targetSquare = document.getElementById(newMove) as HTMLDivElement;
		const pieceInTargetSquare = targetSquare?.firstElementChild;

		if (pieceInTargetSquare) {
			const pieceOwner = pieceInTargetSquare.getAttribute("data-player");

			if (pieceOwner !== this.player) {											// If the piece does not belong to the player who is moving, the move is valid.
				possibleMoves.push(newMove);
			}
		}
	}

	// Capture an opponent by moving one square up(w) / down(b) and one to the right.

	if (this.player === "w") {													
		newMove = lettersArray[squareLetterIndex + 1] + (squareNumber + 1);						
	} else {
		newMove = lettersArray[squareLetterIndex + 1] + (squareNumber - 1);
	}
	
	if (this.checkPossibleMove(newMove)) {												// If the square exists, check if there is a piece in it.
		const targetSquare = document.getElementById(newMove) as HTMLDivElement;
		const pieceInTargetSquare = targetSquare?.firstElementChild;

		if (pieceInTargetSquare) {
			const pieceOwner = pieceInTargetSquare.getAttribute("data-player");

			if (pieceOwner !== this.player) {											// If the piece does not belong to the player who is moving, the move is valid.
				possibleMoves.push(newMove);
			}
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

	let newPieceElement: Piece;
	let newPiecesList: Piece[] = [];

	const newId = completeTurnData.completeTurn;														// Generates unique identifiers (id) for the new pieces resulting from the transformation.

	switch (newPiece) {
	case "Q":
		newPieceElement = new Rook(`R${newId}`, "w", "images/pieces/rookW.png", this.square, true);
		break;

	case "q":
		newPieceElement = new Rook(`R${newId}`, "b", "images/pieces/rookB.png", this.square, true);
		break;

	case "R":
		newPieceElement = new Rook(`R${newId}`, "w", "images/pieces/rookW.png", this.square, true);
		break;

	case "r":
		newPieceElement = new Rook(`r${newId}`, "b", "images/pieces/rookB.png", this.square, true);
		break;
	
	case "B":
		newPieceElement = new Rook(`R${newId}`, "w", ".images/pieces/rookW.png", this.square, true);	
		break;

	case "b":
		newPieceElement = new Rook(`R${newId}`, "b", "images/pieces/rookB.png", this.square, true);
		break;

	case "K":
		newPieceElement = new Rook(`R${newId}`, "w", "images/pieces/rookW.png", this.square, true);
		break;

	case "k":
		newPieceElement = new Rook(`R${newId}`, "b", "images/pieces/rookb.png", this.square, true);
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