import { useEffect } from "react";
import generateSquares from "../utils/generateSquares";
import styles from "./Board.module.scss";
import { piecesData, selectedPieceData } from "../globals/gameData";
import { useGameStateContext } from "../context/GameStateContext";

type BoardProps = {
	showPieces: boolean
}

function Board( {showPieces}: BoardProps) {
	const [playerTurnData, gameStateData] = useGameStateContext();
	const {playerTurn, setPlayerTurn} = playerTurnData;
	const {gameState, setGameState} = gameStateData;

	// These variables are used inside functions but located here so that useEffect can access them in its cleanup function.
	let selectableSquares: string[] = [];
	let targetSquares: string[];

	function clickTargetSquare ( this: HTMLDivElement ) {
		console.log("Soy la casilla objetivo" + this.id);
	}

	function selectPiece ( this: HTMLDivElement ) {
		const piece = this.firstChild as HTMLImageElement;
		const pieceId = piece.id;
		const alreadySelectedPiece = selectedPieceData.selectedPiece;

		if (alreadySelectedPiece)  {									// If a piece was already selected, deselects it (remove classes) and remove event listeners.
			piecesData.pieces.map( (element) => {
				if (element.id === alreadySelectedPiece) element.deselectPiece();
			});

			targetSquares.map( (element) => {
				const square = document.getElementById(element) as HTMLDivElement;
				square.removeEventListener("click", clickTargetSquare);
			});
		} 															
		
		if (alreadySelectedPiece !== pieceId) {							// clicking on an already selected piece should deselect it, not reselect it.
			piecesData.pieces.map( (element) => {
				targetSquares = element.possibleMoves;

				if (element.id === pieceId) element.selectPiece();		// Selects the new piece (applies classes).

				targetSquares.map( (element) => {
					const square = document.getElementById(element) as HTMLDivElement;
					square.addEventListener("click", clickTargetSquare);
				});

			});
		}
		
	}

	function makePiecesSelectable () {						// Assign an event listener to the squares that contain a piece of the player whose turn it is to move, so that he can select any of his pieces, but not the opponent's pieces.
		piecesData.pieces.map( (element) => {			
			if (element.player ===  playerTurn) selectableSquares = [...selectableSquares, element.square];
		});

		selectableSquares.map( (element) => {
			const square = document.getElementById(element) as HTMLDivElement;
			square.addEventListener("click", selectPiece);
		});
	}

	useEffect( () => {
		piecesData.pieces.map( (element) => {							// Updates possible moves for all pieces at the start of the turn.
			element.calcPossibleMoves();
		});

		makePiecesSelectable();

		return () => {
			// Eliminate the event listeners of the squares that move this turn. 

			selectableSquares.map( (element) => {
				const square = document.getElementById(element) as HTMLDivElement;
				square.removeEventListener("click", selectPiece);
			});

			// Eliminate the event listeners of the target squares defined by clicking on a piece of the player whose turn it is. 

			if (targetSquares) {
				targetSquares.map( (element) => {
					const square = document.getElementById(element) as HTMLDivElement;
					square.removeEventListener("click", clickTargetSquare);
				});
			}
		};

	});

	return (
		<div className={styles.mainContainer} >
			<div className={styles.boardContainer} >
				<div className={styles.frameContainer} >
					<div className={styles.sqaresContainer}>
						{
							showPieces
							? generateSquares(piecesData.pieces, true)		// The generateSquares function can return the squares with their pieces, or just the squares. 
							: generateSquares(piecesData.pieces, false)
						}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Board;
