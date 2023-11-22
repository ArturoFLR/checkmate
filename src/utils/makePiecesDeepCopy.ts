import Bishop from "../classes/Bishop";
import King from "../classes/King";
import Knight from "../classes/Knight";
import Pawn from "../classes/Pawn";
import { PiecesType } from "../classes/PiecesType";
import Queen from "../classes/Queen";
import Rook from "../classes/Rook";
import { piecesData } from "../globals/gameData";

export function makePiecesDeepCopy () {																// The JSON format DOES NOT store object methods (it cannot store functions), it only stores properties, so we must create new objects based on those properties. For this we will use the object constructor.
	const piecesCopyJson: string = JSON.stringify(piecesData.pieces);
	const piecesCopyParsed: PiecesType[] = JSON.parse(piecesCopyJson);

	const piecesCopy: PiecesType[] = [];
	
	piecesCopyParsed.map( (element) => {														
		let newPiece: PiecesType;

		switch (element.id[0]) {
		case "P":
			newPiece = new Pawn(element.id, element.player, element.image, element.square);
			break;
	
		case "p":
			newPiece = new Pawn(element.id, element.player, element.image, element.square);
			break;
		
		case "R":
			newPiece = new Rook(element.id, element.player, element.image, element.square);
			break;
		
		case "r":
			newPiece = new Rook(element.id, element.player, element.image, element.square);
			break;

		case "N":
			newPiece = new Knight(element.id, element.player, element.image, element.square);
			break;
		
		case "n":
			newPiece = new Knight(element.id, element.player, element.image, element.square);
			break;
		
		case "B":
			newPiece = new Bishop(element.id, element.player, element.image, element.square);
			break;
		
		case "o":
			newPiece = new Bishop(element.id, element.player, element.image, element.square);
			break;

		case "Q":
			newPiece = new Queen(element.id, element.player, element.image, element.square);
			break;
		
		case "q":
			newPiece = new Queen(element.id, element.player, element.image, element.square);
			break;
		
		case "K":
			newPiece = new King(element.id, element.player, element.image, element.square);
			break;
		
		case "k":
			newPiece = new King(element.id, element.player, element.image, element.square);
			break;
	
		default:
			break;
		}

		newPiece!.possibleMoves = element.possibleMoves;													// We set the properties for which there is no constructor directly.
		newPiece!.impossibleMovesForKings = element.impossibleMovesForKings;
		if (element.id[0] === "P" || element.id[0] === "p") newPiece!.isFirstMove = element.isFirstMove;
		if (element.id[0] === "P" || element.id[0] === "p") newPiece!.possibleMovesForKings = element.possibleMovesForKings;
		if (element.id === "K" || element.id === "k") newPiece!.isCheck = element.isCheck;
		if (element.id === "K" || element.id === "k") newPiece!.isShortCastlingPossible = element.isShortCastlingPossible;
		if (element.id === "K" || element.id === "k") newPiece!.isLongCastlingPossible = element.isLongCastlingPossible;
		if (element.id === "K" || element.id === "k") newPiece!.invalidSquaresDueToCheck = element.invalidSquaresDueToCheck;

		piecesCopy.push(newPiece!);
	});

	return piecesCopy!;
}