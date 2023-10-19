import Piece from "./Piece";

class Pawn extends Piece {
	isFirstMove = true;
	constructor( id: string, image: string, square: string ){
		super(id, image, square);
	}
	calcPossibleMoves () {
		this.possibleMoves = ["e3", "e4"];
	}
	selectPiece () {
		console.log("selected!");
	}
	deselectPiece () {
		console.log("deselected");
	}
	movePiece () {
		console.log("moved");
	}
	animateMove () {
		console.log("animated");
	}
	die () {
		console.log("dead!");
	}
	animateDie () {
		console.log("dying!");
	}
}

export default Pawn;