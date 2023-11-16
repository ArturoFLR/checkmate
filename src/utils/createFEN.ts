import { PlayerTurnType } from "../context/GameStateContext";
import { completeTurnData, enPassantTargetData, halfTurnData, piecesData } from "../globals/gameData";

export function createFEN ( playerTurn: PlayerTurnType ) {											// Translates the current game state into FEN notation, using other sub-functions
	const squares = translateSquares();
	const castling = translateCastling();
	const enPassant = translateEnPassant();
	const halfTurn = halfTurnData.halfTurn;
	const completeTurn = completeTurnData.completeTurn;



	const finishedFEN = squares + " " + playerTurn + " " + castling + " " + enPassant + " " + halfTurn + " " + completeTurn;

	return finishedFEN;
}



function translateEnPassant () {
	const {enPassantTargetSquare, enPassantTargetCounter} = enPassantTargetData;

	if (enPassantTargetSquare && enPassantTargetCounter === 1) {
		return enPassantTargetSquare;
	} else {
		return "-"; 
	}
}

function translateCastling () {
	let whiteCastling = "";
	let blackCastling = "";

	piecesData.pieces.map( (element) => {
		if (element.id[0] === "K") {
			
			if (element.isShortCastlingPossible) whiteCastling = whiteCastling + "K";
			if (element.isLongCastlingPossible) whiteCastling = whiteCastling + "Q";
		}
	});

	piecesData.pieces.map( (element) => {
		if (element.id[0] === "k") {
			
			if (element.isShortCastlingPossible) blackCastling = blackCastling + "k";
			if (element.isLongCastlingPossible) blackCastling = blackCastling + "q";
		}
	});

	if (!whiteCastling && !blackCastling) {
		return "-";
	} else {
		return whiteCastling + blackCastling;
	}
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
					emptySqares = 0;
					fenSequence = fenSequence + pieceId;
					isSquareEmpty = false;
				}
			});

			if (isSquareEmpty) {
				emptySqares++;
				if (letter === "h") {
					fenSequence = fenSequence + emptySqares;
					emptySqares = 0;
				}
			}
		});
	}

	return fenSequence;
}