import Piece from "./Piece";

class Pawn extends Piece {
	public isFirstMove = true;
	constructor( id: string, player: "b" | "w", image: string, square: string ){
		super(id, player, image, square);
	}
	calcPossibleMoves () {
		this.possibleMoves = ["a3", "a4", "e1", "e4"];
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

function calcPossibleMoves  (this: Pawn ) {
	const squareLetter = this.square[0];
}