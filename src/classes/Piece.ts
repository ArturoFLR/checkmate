abstract class Piece {
	protected possibleMoves: string[] = [];
	constructor( public id: string, public image: string, public square: string ) {}

	abstract calcPossibleMoves (): void  ;
	abstract selectPiece (): void;
	abstract deselectPiece (): void;
	abstract movePiece (targetSquare: string): void;
	abstract animateMove (targetSquare: string): void;
	abstract die ():  void;
	abstract animateDie (): void;
}

export default Piece;