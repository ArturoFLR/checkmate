import { ReactElement } from "react";
import styles from "../components/Board.module.scss";
import { useGameStateContext } from "../context/GameStateContext";
import { PiecesType } from "../classes/PiecesType";

function generateSquares ( piecesList: PiecesType[], withPieces: boolean ) {					// Generates an array with the board squares and the pieces on them, if any.
	const [playerTurnData, gameStateData] = useGameStateContext();
	const {playerTurn} = playerTurnData;
	const {gameState,} = gameStateData;									
	const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
	const numbers = ["8", "7", "6", "5", "4", "3", "2", "1"];
	const pieces = piecesList;
	let squareList: ReactElement<HTMLDivElement>[] = [];										// This variable will store the final array of squares.

	numbers.map( (number) => {												// This variable is temporary because it stores an array of 8 arrays. It will be simplified to a single array in the "squareList" variable
		let isWhite: boolean;

		if (Number(number) % 2 === 0) {										// Even squares start with a white square. The odd ones with a black one.
			isWhite = true;
		} else {
			isWhite = false;
		}

		return letters.map( (letter) => {
			const squareName = letter + number;
			let squareClass: string;
			let piece: PiecesType | undefined;

			if (isWhite === true) {
				squareClass = styles.whiteSquare;
			} else {
				squareClass = styles.blackSquare;
			}

			pieces.map( (element) => {										// Check  if there should be a piece in this square
				if ( element.square === squareName ) {
					piece = element;
				}
			});
			
			if (piece && withPieces) {													// If there is a piece, add an <img> with its data to the square
				let kingInCheckClassName: null | string;

				if ((piece.id[0] === "K" || piece.id[0] === "k") && piece.isCheck === true && (gameState !== "gameWinP1" && gameState !== "gameWinP2")) {
					kingInCheckClassName = styles.checked;
				} else {
					kingInCheckClassName = null;
				}
				
				{
					playerTurn === piece.player
					
						? 	squareList = [...squareList, (
							<div key={squareName} id={squareName} className={`${squareClass} ${styles.increasePieceScale} ${kingInCheckClassName}`}>
								<img alt="Piece" src={piece.image} id={piece.id} data-player={piece.player} ></img>
							</div>
						)]
					
						:   squareList = [...squareList, (
							<div key={squareName} id={squareName} className={`${squareClass} ${kingInCheckClassName}`}>
								<img alt="Piece" src={piece.image} id={piece.id} data-player={piece.player} ></img>
							</div>
						)];
				}											

			} else {
				squareList = [...squareList, <div key={squareName} id={squareName} className={squareClass}></div>];
			}


			isWhite = !isWhite;					// Change the color for the next square.	
		});
	});
	
	return squareList;
}

export default generateSquares;