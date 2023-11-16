import { useEffect, useState } from "react";
import styles from "./MainMenu.module.scss";
import { useGameStateContext } from "../context/GameStateContext";
import { SavedGameType } from "./SaveGame";
import { player1Data, player2Data } from "../globals/playersData";
import { aiLevelData, completeTurnData, enPassantTargetData, halfTurnData, isAIGameData, isPieceDyingData, lastPawnMovedData, pawnToTransformData, piecesData, selectedPieceData, transformedPieceToAnimateData } from "../globals/gameData";
import { PiecesType } from "../classes/PiecesType";
import Pawn from "../classes/Pawn";
import Rook from "../classes/Rook";
import Knight from "../classes/Knight";
import Bishop from "../classes/Bishop";
import Queen from "../classes/Queen";
import King from "../classes/King";

type OptionSelected = "init" | "load" | "new";

function MainMenu() {

	const [optionSelected, setOptionSelected] = useState<OptionSelected>("init");
	const [playerTurnData, gameStateData] = useGameStateContext();
	const setGameState = gameStateData.setGameState;
	let selectedSlot: string = "";													// Stores the id of the slot selected by the user.
	let slotsHighLightAnimTimeout: number;

	const loadData1 = localStorage.getItem("checkMateSave1");													// Here the data of each game is saved in JSON format.
	const loadData2 = localStorage.getItem("checkMateSave2");
	const loadData3 = localStorage.getItem("checkMateSave3");
	
	let slot1: SavedGameType | null = null;																		// The JSON.parse() of the data for each game (if any) will be saved here.
	let slot2: SavedGameType | null = null;
	let slot3: SavedGameType | null = null;


	if (loadData1) {
		slot1 = JSON.parse(loadData1);
	}
	if (loadData2) {
		slot2 = JSON.parse(loadData2);
	}
	if (loadData3) {
		slot3 = JSON.parse(loadData3);
	}

	function handleNewGameClick () {
		setOptionSelected("new");
	}

	function handleLoadGameClick () {
		if (optionSelected !== "load") {
			setOptionSelected("load");
		} else {
			setOptionSelected("init");
		}
	}

	function handlePlayerVsComputerClick () {
		isAIGameData.setIsAIGame(true);
		setGameState("select1Player");
	}

	function handle2Players () {
		isAIGameData.setIsAIGame(false);
		setGameState("select2Players");
	}

	function handleBackClick () {
		setOptionSelected("init");
	}

	function handleSlotClick (event: React.MouseEvent<HTMLParagraphElement>) {								// sets the value of "selected Slot". Removes any existing highlighting styles and highlights the selected slot.
		const clickedSlot = event.target as HTMLParagraphElement;

		selectedSlot = clickedSlot.id;
		removeHighlightedSlotStyles();
		clickedSlot.classList.add(styles.slotHighlighted);
	}

	function removeHighlightedSlotStyles () {																// Removes any existing highlighting styles
		const highlightedSlot = document.querySelector(`.${styles.slotHighlighted}`);								
		if (highlightedSlot) highlightedSlot.classList.remove(styles.slotHighlighted);
	}

	function handleSelectBtnClick () {
		if (selectedSlot) {																					// The user must have previously selected a slot.
			let slotToLoad: SavedGameType | null = null;
			const piecesTemp: PiecesType[] = []; 															// The list of pieces recovered from a slot will be saved here.

			switch (selectedSlot) {
			case "slot1":
				slotToLoad = slot1!;	
				break;

			case "slot2":
				slotToLoad = slot2!;	
				break;

			case "slot3":
				slotToLoad = slot3!;	
				break;
			}

			slotToLoad!.pieces.map( (element) => {														// The JSON format DOES NOT store object methods (it cannot store functions), it only stores properties, so we must create new objects based on those properties. For this we will use the object constructor.
				let newPiece: PiecesType;

				switch (element.id[0]) {
				case "P":
					newPiece = new Pawn(element.id, element.player, element.image, element.square);
					break;
			
				case "p":
					newPiece = new Pawn(element.id, element.player, element.image, element.square);
					break;
				
				case "R":
					newPiece = new Rook(element.id, element.player, element.image, element.square);
					break;
				
				case "r":
					newPiece = new Rook(element.id, element.player, element.image, element.square);
					break;

				case "N":
					newPiece = new Knight(element.id, element.player, element.image, element.square);
					break;
				
				case "n":
					newPiece = new Knight(element.id, element.player, element.image, element.square);
					break;
				
				case "B":
					newPiece = new Bishop(element.id, element.player, element.image, element.square);
					break;
				
				case "o":
					newPiece = new Bishop(element.id, element.player, element.image, element.square);
					break;

				case "Q":
					newPiece = new Queen(element.id, element.player, element.image, element.square);
					break;
				
				case "q":
					newPiece = new Queen(element.id, element.player, element.image, element.square);
					break;
				
				case "K":
					newPiece = new King(element.id, element.player, element.image, element.square);
					break;
				
				case "k":
					newPiece = new King(element.id, element.player, element.image, element.square);
					break;
			
				default:
					break;
				}

				newPiece!.possibleMoves = element.possibleMoves;													// We set the properties for which there is no constructor directly.
				newPiece!.impossibleMovesForKings = element.impossibleMovesForKings;
				if (element.id[0] === "P" || element.id[0] === "p") newPiece!.isFirstMove = element.isFirstMove;
				if (element.id[0] === "P" || element.id[0] === "p") newPiece!.possibleMovesForKings = element.possibleMovesForKings;
				if (element.id === "K" || element.id === "k") newPiece!.isCheck = element.isCheck;
				if (element.id === "K" || element.id === "k") newPiece!.isShortCastlingPossible = element.isShortCastlingPossible;
				if (element.id === "K" || element.id === "k") newPiece!.isLongCastlingPossible = element.isLongCastlingPossible;
				if (element.id === "K" || element.id === "k") newPiece!.invalidSquaresDueToCheck = element.invalidSquaresDueToCheck;

				piecesTemp.push(newPiece!);
			});

			// We restore the value of all variables.

			player1Data.changePlayerData(slotToLoad!.player1Name, slotToLoad!.player1Portrait);
			player2Data.changePlayerData(slotToLoad!.player2Name, slotToLoad!.player2Portrait);
			piecesData.setPieces(piecesTemp);
			selectedPieceData.setSelectedPiece(slotToLoad!.selectedPiece);
			enPassantTargetData.setEnPassantTarget(slotToLoad!.enPassantTargetSquare, slotToLoad!.enPassantTargetCounter);
			halfTurnData.setHalfTurn(slotToLoad!.halfTurn);
			completeTurnData.setCompleteTurn(slotToLoad!.completeTurn);
			lastPawnMovedData.setLastPawnMoved(slotToLoad!.lastPawnMoved);
			isPieceDyingData.setIsPieceDying(slotToLoad!.isPieceDying);
			pawnToTransformData.setPawnToTransform(slotToLoad!.pawnToTransform);
			transformedPieceToAnimateData.setTransformedPieceToAnimate(slotToLoad!.transformedPieceToAnimate);
			aiLevelData.setAiLevel(slotToLoad!.aiLevel);
			isAIGameData.setIsAIGame(slotToLoad!.isAIGame);
			playerTurnData.setPlayerTurn(slotToLoad!.playerTurn);
			gameStateData.setGameState(slotToLoad!.gameState);

		} else {																					// If the user has not selected a slot, we apply a warning animation on the container of all slots.
			const slots = document.getElementById("loadGameGameList") as HTMLDivElement;
			slots.classList.add(styles.higlightSlots);
			slotsHighLightAnimTimeout = setTimeout( () => {
				slots.classList.remove(styles.higlightSlots);
			}, 500);
		}
	}


	useEffect(() => {
		return () => {
			clearTimeout(slotsHighLightAnimTimeout);
		};
	});


	if (optionSelected === "init") {
		return (
			<div className={styles.mainContainer} >
				<div className={styles.newGameContainer}>
					<button type="button" className={styles.btnNewGame} onClick={handleNewGameClick} >NEW GAME</button>
				</div>
	
				<div className={styles.loadGameContainer}>
					<button type="button" className={styles.btnLoadGame} onClick={handleLoadGameClick} >LOAD GAME</button>
				</div>

				<div className={styles.leftFormatter} ></div>
				<div className={styles.rigthFormatter} ></div>
			</div>
		);
	} else if (optionSelected === "load") {
		return (
			<div className={styles.mainContainer} >
				<div className={styles.newGameContainer}>
					<button type="button" className={styles.btnNewGame} onClick={handleNewGameClick} >NEW GAME</button>
				</div>
	
				<div className={styles.loadGameContainer}>
					<button type="button" className={styles.btnLoadGame} onClick={handleLoadGameClick} >LOAD GAME</button>
					<div className={styles.loadGameGameList} id="loadGameGameList">
						{
							slot1 
								? <p className={styles.slotWithData} onClick={handleSlotClick} id="slot1">{slot1.userName}</p>
								: <p className={styles.emptySlot} id="slot1">Empty</p>
						}

						{
							slot2 
								? <p className={styles.slotWithData} onClick={handleSlotClick} id="slot2">{slot2.userName}</p>
								: <p className={styles.emptySlot} id="slot2">Empty</p>
						}

						{
							slot3 
								? <p className={styles.slotWithData} onClick={handleSlotClick} id="slot3">{slot3.userName}</p>
								: <p className={styles.emptySlot} id="slot3">Empty</p>
						}
					</div>
					<button type="button" className={styles.btnSelect} onClick={handleSelectBtnClick}>Select</button>
				</div>

				<div className={styles.leftFormatter} ></div>
				<div className={styles.rigthFormatter} ></div>
			</div>
		);
	} else if (optionSelected === "new") {
		return (
			<div className={styles.mainContainer} >
				<div className={styles.playerVsComputerContainer} >
					<button type="button" className={styles.btnPlayerVsComputer} onClick={handlePlayerVsComputerClick} >PLAYER VS COMPUTER</button>
				</div>

				<div className={styles.onePlayerContainer} > 
					<button type="button" className={styles.btnOnePlayer} onClick={handle2Players} >2 PLAYERS</button>
				</div>

				<div className={styles.backContainer} >
					<button type="button" className={styles.btnBack} onClick={handleBackClick} >BACK</button>
				</div>

				<div className={styles.leftFormatter} ></div>
				<div className={styles.rigthFormatter} ></div>
			</div>
		);
	}

}

export default MainMenu;