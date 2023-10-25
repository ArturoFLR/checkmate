import styles from "../components/Board.module.scss";
import { selectedPieceData } from "../globals/gameData";

abstract class Piece {
	public possibleMoves: string[] = [];
	constructor( public id: string, public player: "b" | "w", public image: string, public square: string ) {}

	abstract calcPossibleMoves (): void ;
	selectPiece = selectPiece;
	deselectPiece = deselectPiece;
	abstract movePiece (targetSquare: string): void;
	abstract animateMove (targetSquare: string): void;
	abstract die ():  void;
	abstract animateDie (): void;
}

function selectPiece (this: Piece) {
	selectedPieceData.setSelectedPiece(this.id);	
	const possibleTargetSquares = this.possibleMoves; 

	possibleTargetSquares.map( (element) => {								// Applies classes to possible target squares. The classes are different depending on whether the square is empty or not.
		const square = document.getElementById(element) as HTMLDivElement;
		if (square.hasChildNodes()) {
			square.classList.add(styles.targetSquareWithPiece);
		} else {
			square.classList.add(styles.targetEmptySquare);
		}
	});
}

function deselectPiece (this: Piece) {
	selectedPieceData.setSelectedPiece("");
	const possibleTargetSquares = this.possibleMoves;

	possibleTargetSquares.map( (element) => {
		const square = document.getElementById(element) as HTMLDivElement;
		square.classList.remove(styles.targetSquareWithPiece);
		square.classList.remove(styles.targetEmptySquare);
	});
}


export default Piece;