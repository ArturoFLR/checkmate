import { useEffect } from "react";
import generateSquares from "../utils/generateSquares";
import styles from "./Board.module.scss";
import { completeTurnData, enPassantTargetData, halfTurnData, isPieceDyingData, pawnToTransformData, piecesData, selectedPieceData, transformedPieceToAnimateData } from "../globals/gameData";
import { useGameStateContext } from "../context/GameStateContext";
import SelectPiece from "./SelectPiece";
import Piece from "../classes/Piece";

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
	let movingPieceTimeout: number;
	let transformPieceTimeout: number;

	console.log(piecesData.pieces);

	function newTurnChecks () {												// Perform the necessary checks at the beginning of a turn, such as activating the pawn transformation animations, or activating the AI if the game is a single player.
		
		if (transformedPieceToAnimateData.transformedPieceToAnimate) {										// Check if any pawn was transformed in the previous turn. If so, activates the transformation animation of the new piece.
			const pieceToAnimateTransform =	transformedPieceToAnimateData.transformedPieceToAnimate;
			pieceToAnimateTransform.animateTransform();

			transformPieceTimeout = setTimeout( () => {
				const transformAnimationOldPawn = document.getElementById("transformAnimationOldPawn") as HTMLImageElement;
				const pieceToAnimateTransformImg = document.getElementById(pieceToAnimateTransform.id) as HTMLImageElement;
				transformAnimationOldPawn.remove();
				pieceToAnimateTransformImg.classList.remove(styles.transformNewPiece);
			},2005);

			transformedPieceToAnimateData.setTransformedPieceToAnimate(null);
		}
	}

	function endTurn () {
		const newEnPassantSquare = enPassantTargetData.enPassantTargetSquare;
		const newEnPassantCounter = enPassantTargetData.enPassantTargetCounter + 1;
		enPassantTargetData.setEnPassantTarget(newEnPassantSquare, newEnPassantCounter);

		halfTurnData.setHalfTurn( halfTurnData.halfTurn + 1);

		completeTurnData.setCompleteTurn( completeTurnData.completeTurn + 1);

		if (playerTurn === "w") {
			setPlayerTurn("b");
		}else {
			setPlayerTurn("w");
		}

		const dieAnimationPending = document.querySelector(`.${styles.dyingPiece}`);								// Fixes a bug where the death animation was still active after the dead piece disappeared and was applied to the one that captured it, making it invisible. Removes any pending death animations.
		if (dieAnimationPending) dieAnimationPending.classList.remove(styles.dyingPiece);
	}

	function checkPawnToTransform () {													// Check if there are any pawns at the ends of the board. If so, it returns its ID. (The color of the piece is not checked, because it is impossible for an own pawn to be on our end of the board).
		const squaresList = ["a8","b8","c8","d8","e8","f8","g8","h8", "a1","b1","c1","d1","e1","f1","g1", "h1"];
		let pawnToTransform: Piece | null = null;

		squaresList.map( (square) => {
			piecesData.pieces.map( (piece) => {
				if (piece.square === square) {
					const pieceIdLetter = piece.id[0];
					if (pieceIdLetter === "P" || pieceIdLetter === "p") {
						pawnToTransform = piece;
					}
				}
			});
		});

		return pawnToTransform;										// Contains "" or the id of a pawn.
	}

	function preEndturnCheks () {
		let fiftyTurnsRule: string = "";
		let allKingsAlive: string = "";
		let canNextPlayerMove: boolean = true;
		let checkMate: boolean = false;
		let pawnToTransform: Piece | null = null;
		// COMPROBAR SI ESTAMOS EN EL TUNO 100 O MÁS Y NO SE TERMINADO EL TURNO CON UN JAQUE A UN REY: TABLAS POR REGLA DE LOS 50 MOVIMIENTOS.
		// COMPROBAR SI AÚN QUEDAN 2 REYES VIVOS. SI NO: END GAME - WIN.
		// COMPROBAR LA LISTA DE MOVIMIENTOS POSIBLES DE CADA JUGADOR. SI EL JUGADOR AL QUE SE LE VA A PASAR EL TURNO NO PUEDE MOVER NADA PERO NO ESTÁ EN JAQUE: TABLAS POR REY AHOGADO.
		// COMPROBAR SI EL JUGADOR AL QUE SE LE VA A PASAR EL TURNO ESTÁ EN JAQUE. SI LO ESTÁ Y NO PUEDE MOVER NADA: END GAME - WIN.

		// COMPROBAR SI HAY UN PEÓN BLANCO EN LA LÍNEA 8 O UNO NEGRO EN LA 1: TransformPiece.

		pawnToTransform = checkPawnToTransform();

		if (pawnToTransform) {
			const selectPieceElement = document.getElementById("selectPieceComponent") as HTMLDivElement;
			selectPieceElement.classList.remove(styles.hideSelectPiece);											// The "Board" component makes the "SelectPiece" component visible. The pawn's "transform" method makes it invisible again.

			pawnToTransformData.setPawnToTransform(pawnToTransform);
		} else {
			endTurn();
		}


	}

	function clickTargetSquare ( this: HTMLDivElement ) {
		const selectedPiece = selectedPieceData.selectedPiece;
		let timer: number;

		targetSquares.map( (element) => {													// Remove event listeners from targetSquares so that the player cannot continue clicking on them.
			const square = document.getElementById(element) as HTMLDivElement;
			square.removeEventListener("click", clickTargetSquare);
		});

		selectableSquares.map( (element) => {												// Remove event listeners from player´s turn pieces so that the player cannot continue clicking on them.
			const square = document.getElementById(element) as HTMLDivElement;
			square.removeEventListener("click", selectPiece);
			square.classList.remove(styles.increasePieceScale);
		});

		piecesData.pieces.map( (element) => {												// Moves the piece and deselects it.
			if (element.id === selectedPiece) {
				element.deselectPiece();
				element.movePiece(this.id);
			}
		});

		if (isPieceDyingData.isPieceDying === true) {
			timer = 1550;
		} else {
			timer = 500;
		}

		movingPieceTimeout = setTimeout( () => preEndturnCheks(), timer);	 							// Wait for the piece's animation to finish before advancing to the next turn.
		
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
		
		if (alreadySelectedPiece !== pieceId) {							// Clicking on an already selected piece should deselect it, not reselect it.
			piecesData.pieces.map( (element) => {
				
				if (element.id === pieceId) {
					targetSquares = element.possibleMoves;
					element.selectPiece();														// Selects the new piece (applies classes to the target squares).

					targetSquares.map( (element) => {											// Applies event listeners to the target squares.
						const square = document.getElementById(element) as HTMLDivElement;
						square.addEventListener("click", clickTargetSquare);
					});
				} 
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
		isPieceDyingData.setIsPieceDying(false);							// Resets the value every turn. It is set to "true" by the "die" method of the pieces
		
		newTurnChecks();

		if (showPieces === true) {
			piecesData.pieces.map( (element) => {							// Updates possible moves for all pieces at the start of the turn.
				element.calcPossibleMoves();
			});

			makePiecesSelectable();
		}

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

			// Eliminates timeout for piece movements.

			clearTimeout(movingPieceTimeout);

			// Eliminates timeout for piece transformations.

			clearTimeout(transformPieceTimeout);
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

			<div className={`${styles.selectPieceContainer} ${styles.hideSelectPiece}`} id="selectPieceComponent">
				<SelectPiece preEndturnCheks={preEndturnCheks} />
			</div>

		</div>
	);
}

export default Board;
