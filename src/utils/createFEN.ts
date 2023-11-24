import { PlayerTurnType } from "../context/GameStateContext";
import { completeTurnData, enPassantTargetData, halfTurnData, piecesData } from "../globals/gameData";

export function createFEN ( playerTurn: PlayerTurnType, isForThreefold?: boolean ) {						// Translates the current game state into FEN notation, using other sub-functions. The optional "isForThreefold" parameter indicates whether the move is called without the "halfTurn" and "completeTurn" counters (this is used by the Board component to check for draws per threefold repetition).
	const squares = translateSquares();
	const castling = translateCastling();
	const enPassant = translateEnPassant();
	const halfTurn = halfTurnData.halfTurn;
	const completeTurn = completeTurnData.completeTurn;

	if (!isForThreefold) {														// If the optional parameter is not entered, it is understood that the complete FEN is being requested.
		isForThreefold = false;
	}
	
	const completeFEN = squares + " " + playerTurn + " " + castling + " " + enPassant + " " + halfTurn + " " + completeTurn;
	const threefoldFEN = squares + " " + playerTurn + " " + castling + " " + enPassant;

	if (isForThreefold) {
		return threefoldFEN;
	} else {
		return completeFEN;
	}
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