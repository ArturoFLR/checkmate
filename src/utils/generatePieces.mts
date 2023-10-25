import Pawn from "../classes/Pawn";

function generatePieces () {
	const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
	let piecesList: Pawn[] = [];
	let idNumber = 1;
	let idNumber2 = 1;

	letters.map( (letter) => {
		for (let i:number = 7; i <= 8; i++) {
			piecesList = [...piecesList, new Pawn(`p${idNumber2}`, "b", "images/pieces/pawnB.png", `${letter}${i}`)];
			idNumber2++;
		}
	});

	letters.map( (letter) => {
		for (let i:number = 1; i <= 2; i++) {
			piecesList = [...piecesList, new Pawn(`P${idNumber}`, "w", "images/pieces/pawnW.png", `${letter}${i}`)];
			idNumber++;
		}
	});

	return piecesList;
}

export default generatePieces;