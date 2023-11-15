import { piecesData } from "../globals/gameData";

export function createFEN () {											// Translates the current game state into FEN notation, using other sub-functions
	return translateSquares();
}



function translateSquares () {											// Converts the state of the squares to FEN notation.
	const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
	let fenSequence = "";

	for (let i = 8; i > 0; i--) {
		let emptySqares = 0;

		if (i < 8) fenSequence = fenSequence + "/";

		letters.map( (letter) => {
			const checkedSquare = letter + i;
			let isSquareEmpty = true;

			piecesData.pieces.map( (piece) => {

				if (piece.square === checkedSquare) {
					let pieceId = piece.id[0];
					if (pieceId === "o") pieceId = "b";												
					if (emptySqares > 0) fenSequence = fenSequence + emptySqares;
					fenSequence = fenSequence + pieceId;
					isSquareEmpty = false;
				}
			});

			if (isSquareEmpty) {
				emptySqares++;
				if (i === 8) fenSequence = fenSequence + emptySqares;
			}
		});
	}

	return fenSequence;
}