import styles from "../components/Board.module.scss";
import { completeTurnData, enPassantTargetData, halfTurnData, isPieceDyingData, lastPawnMovedData, pawnToTransformData, piecesData, selectedPieceData, transformedPieceToAnimateData } from "../globals/gameData";
import generatePieces from "./generatePieces.mts";

export function resetGameState ( squaresToClean: React.ReactElement<HTMLDivElement>[] ) {

	squaresToClean.map( (element) => {
		const square = document.getElementById(element.props.id) as HTMLDivElement;
		square.classList.remove(styles.targetSquareWithPiece);
		square.classList.remove(styles.targetEmptySquare);
		square.classList.remove(styles.selectedSquare);
		square.classList.remove(styles.noValidSquareForKings);
		square.classList.remove(styles.checked);
	});

	piecesData.setPieces(generatePieces());
	selectedPieceData.setSelectedPiece("");
	enPassantTargetData.setEnPassantTarget("", 0);
	halfTurnData.setHalfTurn(0);
	completeTurnData.setCompleteTurn(0);
	lastPawnMovedData.setLastPawnMoved("");
	isPieceDyingData.setIsPieceDying(false);
	pawnToTransformData.setPawnToTransform(null);
	transformedPieceToAnimateData.setTransformedPieceToAnimate(null);
}