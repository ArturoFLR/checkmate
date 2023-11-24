import { useEffect } from "react";
import generateSquares from "../utils/generateSquares";
import styles from "./Board.module.scss";
import styles2 from "./PlayerData.module.scss";
import { completeTurnData, enPassantTargetData, halfTurnData, isAIGameData, isAIThinkingData, isPieceDyingData, pawnToTransformData, piecesData, previousPlaysListData, selectedPieceData, transformedPieceToAnimateData } from "../globals/gameData";
import { useGameStateContext } from "../context/GameStateContext";
import SelectPiece from "./SelectPiece";
import King, { kingDyingExplosionTimeout } from "../classes/King";
import { PiecesType } from "../classes/PiecesType";
import GameResults from "./GameResults";
import { getBestMove } from "../services/stockfish/interface";
import { transformPieceTimeout } from "../classes/Piece";
import { makePiecesDeepCopy } from "../utils/makePiecesDeepCopy";
import { resetGameState } from "../utils/resetGameState";
import { createFEN } from "../utils/createFEN";


type AiMoveType = {
    originSquare: string;
    targetSquare: string;
}

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
	let aiActionsTimeout: number;
	let aiActions2Timeout: number;
	let waitForKingToDieTimeout: number;

	const squaresToClean = generateSquares(piecesData.pieces, false);				// This variable contains all the squares on the board. It is used to pass it as an argument to the "resetGameState" function, which is in the "utils" folder. Board uses this function to reset all variables and styles when there is a connection error and the player decides to exit the game. It is declared here and not within the functions that use it because it uses a global variable and gives an error if you try to access it from a sub-function.


	function newTurnChecks () {												// Perform the necessary checks at the beginning of a turn, such as activating the pawn transformation animations, or activating the AI if the game is a single player.
		
		if (transformedPieceToAnimateData.transformedPieceToAnimate) {										// Check if any pawn was transformed in the previous turn. If so, activates the transformation animation of the new piece.
			const pieceToAnimateTransform =	transformedPieceToAnimateData.transformedPieceToAnimate;
			pieceToAnimateTransform.animateTransform();

			transformedPieceToAnimateData.setTransformedPieceToAnimate(null);
		}
	}

	function endTurn () {
		const newEnPassantSquare = enPassantTargetData.enPassantTargetSquare;
		const newEnPassantCounter = enPassantTargetData.enPassantTargetCounter + 1;
		enPassantTargetData.setEnPassantTarget(newEnPassantSquare, newEnPassantCounter);

		halfTurnData.setHalfTurn( halfTurnData.halfTurn + 1);

		if (playerTurnData.playerTurn === "b") completeTurnData.setCompleteTurn( completeTurnData.completeTurn + 1);

		previousPlaysListData.addPlayToList(createFEN(playerTurn, true));										// Used to check threefold repetition (DRAW)

		if (playerTurn === "w") {
			setPlayerTurn("b");
		}else {
			setPlayerTurn("w");
		}

		removePendingDieAnimation();
	}


	function changeLoadingDialogVisibility( visible: boolean ) {						// This function is used to pop up a "loading" dialog in the "PlayerData" component without changing the gameState, as it generates logic errors in the endgame.
		const loadingDialogElement = document.getElementById("loadingDialog") as HTMLDivElement;

		if (visible) {
			loadingDialogElement.classList.remove(styles2.dialogHidden);
		} else {
			loadingDialogElement.classList.add(styles2.dialogHidden);
		}
	}


	function generateAiActions () {
		let aiMove: AiMoveType;

		getBestMove(playerTurn)
			.then( (response) => {
				let timer: number;
				aiMove = response;

				isAIThinkingData.setIsAIThinking(true);

				if (aiMove.originSquare) {
					let pieceToMove: PiecesType;

					piecesData.pieces.map( (element) => {												// Looks for the object that is in that square.
						if (element.square === aiMove.originSquare) pieceToMove = element;
					});

					aiActions2Timeout = setTimeout( () => {
						pieceToMove!.movePiece(aiMove.targetSquare);
						
						if (isPieceDyingData.isPieceDying === true) {
							timer = 1550;
						} else {
							timer = 500;
						}
				
						movingPieceTimeout = setTimeout( () => {
							changeLoadingDialogVisibility(false);
							preEndturnCheks();
						}, timer);	 							// Wait for the piece's animation to finish before advancing to the next turn.
					} , 1000);
				}
			})
			.catch( (err) => {
				const exitGameDialog = document.getElementById("axiosErrorContainer") as HTMLDivElement;

				console.log("Board Error: " + " " + err);
				exitGameDialog.classList.remove(styles.hidden);
			});
	}


	function removePendingDieAnimation () {																	// Fixes a bug where the death animation was still active after the dead piece disappeared and was applied to the one that captured it, making it invisible. Removes any pending death animations.		
		const dieAnimationPending = document.querySelector(`.${styles.dyingPiece}`);								
		if (dieAnimationPending) dieAnimationPending.classList.remove(styles.dyingPiece);
	}

	function checkPawnToTransform (): PiecesType | null {							// Called by "preEndturnCheks". Checks if there are any pawns at the ends of the board. If so, it returns its ID. (The color of the piece is not checked, because it is impossible for an own pawn to be on our end of the board).
		const squaresList = ["a8","b8","c8","d8","e8","f8","g8","h8", "a1","b1","c1","d1","e1","f1","g1", "h1"];
		let pawnToTransform: PiecesType | null = null;

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

		return pawnToTransform;										// Contains null or the id of a pawn.
	}

	function checkFiftyTurnsRule (): boolean {						// Called by "preEndturnCheks"
		if (halfTurnData.halfTurn === 100) {
			return true;
		} else {
			return false;
		}
	}



	function refreshPiecesMovements () {								// Refresh the piece´s "possibleMoves" propert

		piecesData.pieces.map( (element) => {							// Updates possible moves for all pieces.
			element.calcPossibleMoves();
		});

		piecesData.pieces.map( (element) => {							// The kings need another pass because in order to calculate their moves they need the rest of the pieces to have already calculated theirs.
			if (element.id === "K" || element.id === "k") {
				element.calcPossibleMoves();
			}
		});
	}



	function testKingsChecked ( withStyles: boolean ) {										// Called by "preEndturnCheks" and "canPlayerRevertChek". The "withStyles" parameter indicates whether king styles should be applied in check or not (the king method "testKingCheckNoStyles" will be used when we are checking hypothetical moves and do not want visual representation of them).
		let isWhiteKingChecked = false;
		let isBlackKingChecked = false;

		refreshPiecesMovements();										// Refresh the piece´s "possibleMoves" property

		piecesData.pieces.map( (element) => {
			if (element.id === "K" || element.id === "k") {
				
				if (withStyles) {
					element.testKingCheck?.();
				} else {
					element.testKingCheckNoStyles?.();
				}
				

				if (element.id === "K") {
					isWhiteKingChecked = element.isCheck!;
				} else {
					isBlackKingChecked = element.isCheck!;
				}
			}
		});

		return {
			w: isWhiteKingChecked,
			b: isBlackKingChecked
		};
	}


	function testAreKingsAlive () {										// Called by "preEndturnCheks"
		let isWhiteKingAlive = false;
		let isBlackKingAlive = false;

		piecesData.pieces.map( (element) => {
			if (element.id[0] === "K") {
				isWhiteKingAlive = true;
			} else if (element.id[0] === "k") {
				isBlackKingAlive = true;
			}
		});

		return {
			w: isWhiteKingAlive,
			b: isBlackKingAlive
		};
	}



	function canPlayerRevertCheck (player: string): boolean {									// It only works as intended if the player passed as argument is in check.
		const piecesDeepCopy: PiecesType[] = makePiecesDeepCopy();											// Makes a DEEP copy of piecesData.pieces, since we are going to be touching their values and then we want to leave them as they were.
		let chekedKing: PiecesType;
		let canRevertCheck = false;

		// There is no need to update the "possibleMoves" property of the pieces, since this function is always executed after "testKingsChecked", which has already done so.

		piecesData.pieces.map( (element) => {														// We get the checked king.
			if (element.player === player && (element.id[0] === "K" || element.id[0] === "k")) {
				chekedKing = element;
			}
		});

		for (let i = 0; i < piecesData.pieces.length; i++) {										// From each of the pieces on the board we are going to take its "possibleMoves" array and we are going to execute each of those moves and check if they break the check. A "for" is used instead of directly a ".map()" because once we are inside the ".map()" loop, even though we update the value of "piecesWorkingCopy" inside the code, every time we make a new ".map()" loop will do it with the initial values, it will not take into consideration the changes we have made. (It seems that at the beginning of a ".map()" the value of "piecesWorkingCopy" is saved in memory and is not updated until the mapping of all the pieces it contains has finished, which generated errors).
			let piecesWorkingCopy: PiecesType[] = makePiecesDeepCopy();
			const piece = piecesWorkingCopy[i];

			if (piece.player === chekedKing!.player && piece.possibleMoves.length > 0) piece.possibleMoves.map( (move) => {			// We only test friendly pieces that have at least one possible movement.
				
				piece.square = move;																								// We execute one of the possible movements of the tested piece.

				piecesWorkingCopy.map( (pieceToCapture) => {																		// If there is an enemy piece on the same square where we move the piece, we must simulate its capture. We do not use the "movePiece" or "die" methods of the pieces, as these generate unwanted side effects, such as animating the movement of the piece around the board or changing the value of "halfMove" (we are only doing a simulation and not we want the user to see it in action).
					if (pieceToCapture.player !== piece.player && pieceToCapture.square === move) {
						
						let piecesCopy: PiecesType[] = [];																			// We capture the piece by deleting it from the parts array.

						piecesWorkingCopy.map( (elementToCopy) => {
							if (elementToCopy.id !== pieceToCapture.id) {
								piecesCopy = [...piecesCopy, elementToCopy];
							}
						});

						piecesWorkingCopy = piecesCopy;
					}
				});

				piecesData.setPieces(piecesWorkingCopy);

				const areKingsChecked = testKingsChecked(false);												// We check if the king is still in check. We do not need to refresh the possible movements of the pieces, since the "testKingsChecked()" function does it internally.													
				
				if ((chekedKing.player === "w" && areKingsChecked.w === false) || (chekedKing.player === "b" && areKingsChecked.b === false) ) {							// If the king is no longer in check, the player can undo the check. We restore the original value of the pieces array and set "canRevertCheck" to "true", then we return "canRevertCheck".
					piecesData.setPieces(piecesDeepCopy);
					canRevertCheck = true;
					return canRevertCheck;
				}
				
				piecesData.setPieces(piecesDeepCopy);														// If the king is still in check, we restore the original value of the pieces array before checking the next move/piece.

			});
		}

		return canRevertCheck;																			// If this line is executed it is because "canRevertCheck" is still "false".
	}



	function testHasPlayersPossibleMoves () {							// Called by "preEndturnCheks"
		let hasWhitePossibleMoves = false;
		let hasBlackPossibleMoves = false;

		// There is no need to update the "possibleMoves" property of the parts, since this function is always executed after "testKingsChecked", which has already done so.

		piecesData.pieces.map( (element) => {
			if (element.possibleMoves.length >= 1) {
				if (element.player === "w") {
					hasWhitePossibleMoves = true;
				} else {
					hasBlackPossibleMoves = true;
				}
			}
		});

		return {
			w: hasWhitePossibleMoves,
			b: hasBlackPossibleMoves
		};
	}



	function testDeadPosition () {
		const whiteSquares = ["a2", "a4", "a6", "a8", "b1", "b3", "b5", "b7", "c2", "c4", "c6", "c8", "d1", "d3", "d5", "d7", "e2", "e4", "e6", "e8", "f1", "f3", "f5", "f7", "g2", "g4", "g6", "g8", "h1", "h3", "h5", "h7"];
		const blackSquares = ["a1", "a3", "a5", "a7", "b2", "b4", "b6", "b8", "c1", "c3", "c5", "c7", "d2", "d4", "d6", "d8", "e1", "e3", "e5", "e7", "f2", "f4", "f6", "f8", "g1", "g3", "g5", "g7", "h2", "h4", "h6", "h8"];

		let possibleWhiteDeadPosition = false;				// These variables indicate whether the player is a possible VICTIM in a Dead Position situation. To confirm the possibility you have to check the color of the players' bishops. To confirm that there is a Dead Position situation, you must also check what pieces the other player has.
		let possibleBlackDeadPosition = false;

		let whiteKnights = 0;								// These variables store the number of pieces of each type that each player has.
		let whiteRooks = 0;
		let whiteBishops = 0;
		let whiteBishopsWhiteSquare = 0;
		let whiteBishopsBlackSquare = 0;
		let whiteQueen = 0;
		let whitePawnsWithMoves = false;

		let blackKnights = 0;														
		let blackRooks = 0;
		let blackBishops = 0;
		let blackBishopsWhiteSquare = 0;
		let blackBishopsBlackSquare = 0;
		let blackQueen = 0;
		let blackPawnsWithMoves = false;


		piecesData.pieces.map( (element) => {

			switch (element.id[0]) {
			case "N":
				whiteKnights++;
				break;

			case "n":
				blackKnights++;
				break;

			case "R":
				whiteRooks++;
				break;
			
			case "r":
				blackRooks++;
				break;

			case "B":
				whiteSquares.map( (square) => {
					if (element.square === square) {
						whiteBishopsWhiteSquare++;
						whiteBishops++;
					}
				});	

				blackSquares.map( (square) => {
					if (element.square === square) {
						whiteBishopsBlackSquare++;
						whiteBishops++;
					}
				});	
				break;

			case "o":
				whiteSquares.map( (square) => {
					if (element.square === square) {
						blackBishopsWhiteSquare++;
						blackBishops++;
					}
				});	

				blackSquares.map( (square) => {
					if (element.square === square) {
						blackBishopsBlackSquare++;
						blackBishops++;
					}
				});	
				break;

			case "Q":
				whiteQueen++;
				break;
			
			case "q":
				blackQueen++;
				break;

			case "P":
				if (element.possibleMoves.length >= 1) {
					whitePawnsWithMoves = true;
				}
				break;
			
			case "p":
				if (element.possibleMoves.length >= 1) {
					blackPawnsWithMoves = true;
				}
				break;

			default:
				break;
			}

		});
			
		// Test White Player Dead Position:

		if (whiteQueen === 0 && whiteRooks === 0 && whitePawnsWithMoves === false && whiteKnights === 0 && (whiteBishopsWhiteSquare === 0 || whiteBishopsBlackSquare === 0)) {
			possibleWhiteDeadPosition = true;
		}

		// Test Black Player Dead Position:

		if (blackQueen === 0 && blackRooks === 0 && blackPawnsWithMoves === false && blackKnights === 0 && (blackBishopsWhiteSquare === 0 || blackBishopsBlackSquare === 0)) {
			possibleBlackDeadPosition = true;
		}

		// Checks Dead Position (King Vs. King):

		if (possibleWhiteDeadPosition && possibleBlackDeadPosition && whiteBishops === 0 && blackBishops === 0) {
			return true;
		}

		// Checks Dead Position (King & Knight Vs. King):

		if (possibleWhiteDeadPosition && whiteBishops === 0) {
			if (blackQueen === 0 && blackRooks === 0 && blackPawnsWithMoves === false && blackBishops === 0 && blackKnights === 1) {
				return true;
			}
		} else if (possibleBlackDeadPosition && blackBishops === 0) {
			if (whiteQueen === 0 && whiteRooks === 0 && whitePawnsWithMoves === false && whiteBishops === 0 && whiteKnights === 1) {
				return true;
			}
		}

		// Checks Dead Position (King & Bishop/s Vs. King  ||  King & Bishop/s Vs. King & Bishop/s)
		if (possibleWhiteDeadPosition && possibleBlackDeadPosition) {
			if (whiteBishops === 0) {
				if (blackBishops > 0) {								// It has bishops, but not both types ("possibleBlackDeadPosition" is "true).
					return true;
				}
			} else if (blackBishops === 0) {
				if (whiteBishops > 0) {
					return true;
				}
			}

			if (whiteBishopsWhiteSquare > 0 && blackBishopsWhiteSquare > 0) {					// If both players have bishops of one type it is not possible for them to have bishops of the other, because "possibleWhiteDeadPosition" and "possibleBlackDeadPosition" are true.
				return true;
			} else if (whiteBishopsBlackSquare > 0 && whiteBishopsBlackSquare > 0) {
				return true;
			}
		}

		return false;
	}


	function checkThreefoldRepetition () {
		const actualPlay = createFEN(playerTurn, true);
		let numberOfThreefoldRepetition = 0;

		previousPlaysListData.previousPlaysList.map( (element) => {
			if (element === actualPlay) {
				numberOfThreefoldRepetition++;
			}
		});

		if (numberOfThreefoldRepetition >= 2) {
			return true;
		} else {
			return false;
		}
	}


	function preEndturnCheks () {
		const threefoldRepetition = checkThreefoldRepetition();
		const areKingsAlive: {w: boolean, b: boolean} = testAreKingsAlive();			// Checks if any of the kings have died.
		const isAnyKingChecked: {w: boolean, b: boolean} = testKingsChecked(true);			// Checks if there are any kings in check. The "testKingsChecked" function uses the kings "testKingCheck" method to do this.
		const fiftyTurnsRule: boolean = checkFiftyTurnsRule();
		let pawnToTransform: PiecesType | null = null;
		let endgame = false;															// A flag used to stop checking if one of the endgame conditions is met.
		let isPlayerChoosingPiece = false;												// Used as a "flag" so that the rest of the checks are not executed while a player chooses which piece he wants to transform a pawn to.
		let whiteKing: PiecesType;														// The objects of the kings. They are saved so we can use their "animateKingDying" method if necessary.
		let blackKing: PiecesType;
		isAIThinkingData.setIsAIThinking(false);

		removePendingDieAnimation();													// Fixes pending dead animation bug.


		// CHECK DRAW BY THREEFOLD REPETITION
		console.log(previousPlaysListData.previousPlaysList);
		if (threefoldRepetition) {
			setGameState("gameDrawThreefoldRepetition");
			endgame = true;
		}

		// End of game due to captured king.

		if (areKingsAlive.w === false) {
			setGameState("gameWinP2");
			endgame = true;
		} else if (areKingsAlive.b === false) {
			setGameState("gameWinP1");
			endgame = true;
		}

		// CHECK IF THERE IS A WHITE PAWN ON LINE 8 OR A BLACK ONE ON LINE 1: TransformPiece.

		pawnToTransform = checkPawnToTransform();

		if (endgame === false) {
			
			if (pawnToTransform && isAIGameData.isAIGame && playerTurn === "b") {
					
				pawnToTransform.transform?.("q");
				
			} else if (pawnToTransform) {
				const selectPieceElement = document.getElementById("selectPieceComponent") as HTMLDivElement;
				selectPieceElement.classList.remove(styles.hideSelectPiece);											// The "Board" component makes the "SelectPiece" component visible. The pawn's "transform" method makes it invisible again.
	
				pawnToTransformData.setPawnToTransform(pawnToTransform);
				isPlayerChoosingPiece = true;																	// The "SelectPiece" component will re-execute this "preEndturnCheks" function when the piece has been chosen, resetting this variable to "false".
			}
		}

		// Stores the objects of the kings. They are saved so we can use their "animateKingDying" method if necessary.

		piecesData.pieces.map( (element) => {
			if (element.id[0] === "K") {
				whiteKing = element;
			} else if (element.id[0] === "k") {
				blackKing = element;
			}
		}); 


		// CHECKS IF THERE IS A KING IN CHECK AND THE PLAYER DOES NOT HAVE LEGAL MOVES (CHECKMATE) OR THE ONES HE HAS CANNOT REMOVE HIM OUT OF CHECK (CHECKMATE) OR HE HAS BEEN PLACED IN CHECK BY ERROR ON HIS OWN TURN AND CAN NO LONGER DO ANYTHING. The "testKingsChecked" function uses the kings "testKingCheck" method to do this.

		if (endgame === false && (isAnyKingChecked.w === true || isAnyKingChecked.b === true) && isPlayerChoosingPiece === false) {

			if (isAnyKingChecked.w) {

				if (playerTurn === "w") {																	// If we are looking at the king that has just been put in check, it is because it was a stupid move by the player himself that generated the check on his turn. Since now comes the opponent's turn, there is nothing he can do to save himself. We do not include the "canPlayerRevertCheck()" condition here because it requires a lot of calculations and is not necessary if we know that it was an irreversible error.
					(whiteKing! as King).animateKingDying();
					endgame = true;

					waitForKingToDieTimeout = setTimeout( () => {
						setGameState("gameWinP2");
					}, 8500);
					
				} else if (!canPlayerRevertCheck("w")) {
					(whiteKing! as King).animateKingDying();
					endgame = true;

					waitForKingToDieTimeout = setTimeout( () => {
						setGameState("gameWinP2");
					}, 8500);
				}

			} else if (isAnyKingChecked.b) {

				if (playerTurn === "b") {																	// If we are looking at the king that has just been put in check, it is because it was a stupid move by the player himself that generated the check on his turn. Since now comes the opponent's turn, there is nothing he can do to save himself. We do not include the "canPlayerRevertCheck()" condition here because it requires a lot of calculations and is not necessary if we know that it was an irreversible error.
					(blackKing! as King).animateKingDying();
					endgame = true;

					waitForKingToDieTimeout = setTimeout( () => {
						setGameState("gameWinP1");
					}, 8500);
				} else if (!canPlayerRevertCheck("b")) {
					(blackKing! as King).animateKingDying();
					endgame = true;

					waitForKingToDieTimeout = setTimeout( () => {
						setGameState("gameWinP1");
					}, 8500);
				}

			}
		}


		// CHECK IF WE ARE ON TURN 100 OR MORE AND THE TURN WAS NOT ENDED WITH A CHECK TO A KING: DRAW BY THE 50 MOVES RULE.

		if (endgame === false && isPlayerChoosingPiece === false && fiftyTurnsRule && isAnyKingChecked.w === false && isAnyKingChecked.b === false) {
			setGameState("gameDraw50Moves");
			endgame = true;
		}


		// IF THE PLAYER TO WHOM THE TURN IS GOING TO BE PASSED IS NOT IN CHECK BUT HAS NO LEGAL MOVES: DRAW BY STALEMATE.
		
		if (endgame === false && isPlayerChoosingPiece === false) {
			const {w, b} = testHasPlayersPossibleMoves();

			if ((isAnyKingChecked.w === false && w === false) || (isAnyKingChecked.b === false && b === false)) {
				setGameState("gameDrawStalemate");
				endgame = true;
			}
		}

		// Check if the players do not have enough pieces to check each other: draw by Dead Position.

		if (endgame === false && isPlayerChoosingPiece === false) {
			if (testDeadPosition()) {
				setGameState("gameDrawDeadPosition");
				endgame = true;
			}
		}

		if (endgame === false && isPlayerChoosingPiece === false) {
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

				if (element.id[0] === "K" || element.id[0] === "k") {							// If the piece is a King, remove styles from the squares where it would be checked.
					(element as King).invalidSquaresDueToCheck.map( (invalidSquare) => {
						const invalidSquareElement = document.getElementById(invalidSquare) as HTMLDivElement;
						invalidSquareElement.classList.remove(styles.noValidSquareForKings);
					});
				}
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
				if (element.id === alreadySelectedPiece) {
					element.deselectPiece();
				
					if (element.id[0] === "K" || element.id[0] === "k") {							// If the piece is a King, remove styles from the squares where it would be checked.
						(element as King).invalidSquaresDueToCheck.map( (invalidSquare) => {
							const invalidSquareElement = document.getElementById(invalidSquare) as HTMLDivElement;
							invalidSquareElement.classList.remove(styles.noValidSquareForKings);
						});
					}
				}
			});

			targetSquares.map( (element) => {											// Remove event listeners.
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

					if (element.id[0] === "K" || element.id[0] === "k") {							// If the piece is a King, apply styles to the squares where it would be checked and to the pieces that generate those squares, so that the player knows why they are not valid.
						(element as King).invalidSquaresDueToCheck.map( (invalidSquare) => {
							const invalidSquareElement = document.getElementById(invalidSquare) as HTMLDivElement;

							invalidSquareElement.classList.add(styles.noValidSquareForKings);
						});
					}
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



	function handleRetryClick () {
		const exitGameDialog = document.getElementById("axiosErrorContainer") as HTMLDivElement;

		exitGameDialog.classList.add(styles.hidden);
		generateAiActions();
	}


	function handleExitGameClick () {
		const exitGameDialog = document.getElementById("axiosErrorContainer") as HTMLDivElement;

		exitGameDialog.classList.add(styles.hidden);
		resetGameState(squaresToClean);																	// This function is in the "utils" folder.
		setPlayerTurn("w");
		setGameState("preGame");
	}



	useEffect( () => {
		if ((gameState === "gameStarted1P" || gameState === "gameStarted2P") && !isAIThinkingData.isAIThinking) {
			isPieceDyingData.setIsPieceDying(false);							// Resets the value every turn. It is set to "true" by the "die" method of the pieces
			
			newTurnChecks();

			refreshPiecesMovements();										// Refresh the piece´s "possibleMoves" property
		}

		if (gameState === "gameStarted2P" && !isAIThinkingData.isAIThinking) {
			makePiecesSelectable();
		}

		if (gameState === "gameStarted1P" && playerTurn === "w" && !isAIThinkingData.isAIThinking) {
			makePiecesSelectable();
		}

		if (gameState === "gameStarted1P" && playerTurn === "b" && !isAIThinkingData.isAIThinking) {
			aiActionsTimeout = setTimeout( () => {
				generateAiActions();
			}, 550);
			changeLoadingDialogVisibility(true);														// Show the "loading" dialog in "PlayerData" component.
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

			if (!isAIThinkingData.isAIThinking) clearTimeout(movingPieceTimeout);

			// Eliminates timeout for piece transformations. This Timeout is generated in the "animateTransform" method of the pieces and imported from the "Piece" class.

			clearTimeout(transformPieceTimeout);

			// Eliminates timeout for dying kings animations. This Timeout is generated in the "animateKingDying" method of the king and imported from the "King" class. Waits for the king to finish moving before inserting the explosion image.

			clearTimeout(kingDyingExplosionTimeout);

			// Eliminates timeout for dying kings animations. This Timeout is generated in the "Board" component. Waits for the king to finish his complete animation before show the "GameResults" component.

			clearTimeout(waitForKingToDieTimeout);

			// Eliminates timeout for AI actions.

			clearTimeout(aiActionsTimeout);

			// Eliminates timeout for AI actions 2.

			if (!isAIThinkingData.isAIThinking) clearTimeout(aiActions2Timeout);
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

			{
				gameState === "gameWinP1" || gameState === "gameWinP2" || gameState === "gameDrawStalemate" || gameState === "gameDrawDeadPosition" || gameState === "gameDraw50Moves" || gameState === "gameDrawThreefoldRepetition"
					? (
						<div className={styles.gameResultsContainer}>
							<GameResults />
						</div>
					)
					: null
			}

			<div className={`${styles.axiosErrorContainer} ${styles.hidden}`} id="axiosErrorContainer">
				<div className={styles.axiosErrorOptionsContainer} >
					<p>Oops! The AI server is not responding... <span>Please, check your network connection</span></p>
					

					<button className={styles.btnAxiosError} type="button" onClick={handleRetryClick}>
						Retry
					</button>

					<button className={styles.btnAxiosError} type="button" onClick={handleExitGameClick}>
						Exit Game
					</button>
				</div>
			</div>
			

		</div>
	);
}

export default Board;
