import King from "../classes/King";
import Pawn from "../classes/Pawn";
import Piece from "../classes/Piece";
import Rook from "../classes/Rook";

function generatePieces () {
	const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
	let piecesList: Piece[] = [];
	let idNumber = 1;
	let idNumber2 = 1;

	// PAWNS

	letters.map( (letter) => {
		const squareNumber = 7;
		piecesList = [...piecesList, new Pawn(`p${idNumber2}`, "b", "images/pieces/pawnB.png", `${letter}${squareNumber}`)];
		idNumber2++;
	});

	letters.map( (letter) => {
		const squareNumber = 2; 
		piecesList = [...piecesList, new Pawn(`P${idNumber}`, "w", "images/pieces/pawnW.png", `${letter}${squareNumber}`)];
		idNumber++;
	});

	// ROOKS

	piecesList = [...piecesList, new Rook("R1", "w", "images/pieces/rookW.png", "a1", true)];
	piecesList = [...piecesList, new Rook("R2", "w", "images/pieces/rookW.png", "h1", true)];
	piecesList = [...piecesList, new Rook("r1", "b", "images/pieces/rookB.png", "a8", true)];
	piecesList = [...piecesList, new Rook("r2", "b", "images/pieces/rookB.png", "h8", true)];

	// KINGS
	piecesList = [...piecesList, new King("K", "w", "images/pieces/kingW.png", "e1")];
	piecesList = [...piecesList, new King("k", "b", "images/pieces/kingB.png", "e8")];

	return piecesList;
}

export default generatePieces;