import Piece from "./Piece";

class Pawn extends Piece {
	isFirstMove = true;
	constructor( id: string, image: string, square: string ){
		super(id, image, square);
	}
	calcPossibleMoves () {
		this.possibleMoves = ["e3", "e4"];
	}

	
	
}