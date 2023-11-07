import Bishop from "../classes/Bishop";
import King from "../classes/King";
import Knight from "../classes/Knight";
import Pawn from "../classes/Pawn";
import { PiecesType } from "../classes/PiecesType";
import Queen from "../classes/Queen";
import Rook from "../classes/Rook";

function generatePieces () {
	const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
	let piecesList: PiecesType[] = [];
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

	piecesList = [...piecesList, new Rook("R1", "w", "images/pieces/rookW.png", "a1")];
	piecesList = [...piecesList, new Rook("R2", "w", "images/pieces/rookW.png", "h1")];
	piecesList = [...piecesList, new Rook("r1", "b", "images/pieces/rookB.png", "a8")];
	piecesList = [...piecesList, new Rook("r2", "b", "images/pieces/rookB.png", "h8")];

	// KNIGHTS

	piecesList = [...piecesList, new Knight("N1", "w", "images/pieces/knightW.png", "b1")];
	piecesList = [...piecesList, new Knight("N2", "w", "images/pieces/knightW.png", "g1")];
	piecesList = [...piecesList, new Knight("n1", "b", "images/pieces/knightB.png", "b8")];
	piecesList = [...piecesList, new Knight("n2", "b", "images/pieces/knightB.png", "g8")];

	// BISHOPS

	piecesList = [...piecesList, new Bishop("B1", "w", "images/pieces/bishopW.png", "c1")];
	piecesList = [...piecesList, new Bishop("B2", "w", "images/pieces/bishopW.png", "f1")];
	piecesList = [...piecesList, new Bishop("o1", "b", "images/pieces/bishopB.png", "c8")];
	piecesList = [...piecesList, new Bishop("o2", "b", "images/pieces/bishopB.png", "f8")];

	// QUEENS

	piecesList = [...piecesList, new Queen("Q", "w", "images/pieces/queenW.png", "d1")];
	piecesList = [...piecesList, new Queen("q", "b", "images/pieces/queenB.png", "d8")];

	// KINGS
	piecesList = [...piecesList, new King("K", "w", "images/pieces/kingW.png", "e1")];
	piecesList = [...piecesList, new King("k", "b", "images/pieces/kingB.png", "e8")];

	return piecesList;
}

export default generatePieces;