import styles from "./SaveGame.module.scss";
import styles2 from "./PlayerData.module.scss";
import { useEffect } from "react";
import { player1Data, player2Data } from "../globals/playersData";
import { completeTurnData, enPassantTargetData, halfTurnData, lastPawnMovedData, piecesData } from "../globals/gameData";
import { GameStateType, PlayerTurnType, useGameStateContext } from "../context/GameStateContext";
import { PiecesType } from "../classes/PiecesType";

export type SavedGameType = {
	userName: string;
    player1Name: string;
    player1Portrait: string;
    player2Name: string;
    player2Portrait: string;
    pieces: PiecesType[];
    selectedPiece: string;
    enPassantTargetSquare: string;
	enPassantTargetCounter: number,
	halfTurn: number,
	completeTurn: number,
	lastPawnMoved: string,
	isPieceDying: boolean,
	pawnToTransform: null,
	transformedPieceToAnimate: null,
	gameState: GameStateType,
    playerTurn: PlayerTurnType;
}

function SaveGame() {
	const [playerTurnData, gameStateData] = useGameStateContext();
	const saveGameDialog = document.getElementById("saveGameMainContainer") as HTMLDivElement;
	const slotsContainer = document.getElementById("slotsContainer") as HTMLDivElement;
	const inputElement = document.getElementById("userInput") as HTMLInputElement;
	const okBtn = document.getElementById("btnOk") as HTMLButtonElement;
	const cancelBtn = document.getElementById("btnCancel") as HTMLButtonElement;
	let slotsHighlightAnimTimeout: number;
	let inputHighlightAnimTimeout: number;
	let newSlotTextAnimTimeout: number;
	let saveGameDialogCloseTiemout: number;

	let selectedSlot: string = "";

	function loadExistingGameNames () {
		const save1 = localStorage.getItem("checkMateSave1");
		let save1Name: string = "Empty";

		const save2 = localStorage.getItem("checkMateSave2");
		let save2Name: string = "Empty";

		const save3 = localStorage.getItem("checkMateSave3");
		let save3Name: string = "Empty";

		if (save1) {
			save1Name = JSON.parse(save1).userName;
		}

		if (save2) {
			save2Name = JSON.parse(save2).userName;
		}

		if (save3) {
			save3Name = JSON.parse(save3).userName;
		}

		return (
			<div className={styles.slotsContainer} id="slotsContainer">
				<button type="button" className={styles.slotName} onClick={handleSlotClick} id="checkMateSave1">
					{
						save1Name
					}
				</button>

				<button type="button" className={styles.slotName} onClick={handleSlotClick} id="checkMateSave2">
					{
						save2Name
					}
				</button>

				<button type="button" className={styles.slotName} onClick={handleSlotClick} id="checkMateSave3">
					{
						save3Name
					}
				</button>
			</div>
		);
	}

	function handleSlotClick (event: React.MouseEvent<HTMLButtonElement>) {
		const clickedSlot = event.target as HTMLButtonElement;

		selectedSlot = clickedSlot.id;
		removeHighlightedSlotStyles();
		clickedSlot.classList.add(styles.btnHighlighted);

		inputElement.disabled = false;
		inputElement.focus();
	}

	function handleEnterKeyPress (event: React.KeyboardEvent<HTMLInputElement>): void {
		if (event.key === "Enter") {
			handleConfirmSaveGame();
		}
	}

	function handleConfirmSaveGame () {
		
		if (selectedSlot) {

			if (validateUserInput()) {
				const newSave: SavedGameType = {
					userName: inputElement.value,
					player1Name: player1Data.name,
					player1Portrait: player1Data.portrait,
					player2Name: player2Data.name,
					player2Portrait: player2Data.portrait,
					pieces: piecesData.pieces,																		// JSON does not save object methods, only properties!!
					selectedPiece: "",
					enPassantTargetSquare: enPassantTargetData.enPassantTargetSquare,
					enPassantTargetCounter: enPassantTargetData.enPassantTargetCounter,
					halfTurn: halfTurnData.halfTurn,
					completeTurn: completeTurnData.completeTurn,
					lastPawnMoved: lastPawnMovedData.lastPawnMoved,
					isPieceDying: false,
					pawnToTransform: null,
					transformedPieceToAnimate: null,
					gameState: gameStateData.gameState,
					playerTurn: playerTurnData.playerTurn
				};

				okBtn.disabled = true;
				cancelBtn.disabled = true;

				animateSavedGame();

				localStorage.setItem(selectedSlot, JSON.stringify(newSave));

			} else {
				inputElement.classList.add(styles.inputHighlighted);
				inputHighlightAnimTimeout = setTimeout( () => {
					inputElement.classList.remove(styles.inputHighlighted);
				}, 500);
			}

		} else {
			slotsContainer.classList.add(styles.slotsContainerHighlighted);
			slotsHighlightAnimTimeout = setTimeout( () => {
				slotsContainer.classList.remove(styles.slotsContainerHighlighted);
			}, 500);
		}
	}

	function handleCancelSaveGame () {
		saveGameDialog.classList.add(styles2.saveHidden);
		inputElement.value = "";
		inputElement.disabled= true;
		selectedSlot = "";
		removeHighlightedSlotStyles();
	}

	function removeHighlightedSlotStyles () {
		const highlightedSlot = document.querySelector(`.${styles.btnHighlighted}`);								
		if (highlightedSlot) highlightedSlot.classList.remove(styles.btnHighlighted);
	}

	function validateUserInput () {
		const inputText = inputElement.value;

		if (inputText) {
			return true;
		} else {
			return false;
		}
	}

	function animateSavedGame () {
		const slotToAnimate = document.getElementById(selectedSlot) as HTMLButtonElement;
		const oldName = slotToAnimate.innerText;
		const oldNameArray = Array.from(oldName);
		let newName = inputElement.value;
		let animatedNewName = "";
		let timer = 0;

		inputElement.value = "";

		if (newName.length < oldName.length) {														// Makes the number of characters in "oldText" and "newText" the same so that there are no errors in the animation.
			const charsToAdd = oldName.length - newName.length;

			for (let i = charsToAdd; i > 0; i--) {
				newName = newName + " ";
			}
		}

		for (let i = 0; i < oldName.length; i++) {
			
			newSlotTextAnimTimeout = setTimeout( () => {
				oldNameArray.splice(0, 1);
				slotToAnimate.innerText = oldNameArray.join("");
			}, timer);

			timer = timer + 100;
		}

		for (let i = 0; i < newName.length; i++) {
			
			newSlotTextAnimTimeout = setTimeout( () => {
				animatedNewName = animatedNewName + newName[i];
				slotToAnimate.innerText = animatedNewName;
			}, timer);

			timer = timer + 100;
		}

		saveGameDialogCloseTiemout = setTimeout( () => {
			saveGameDialog.classList.add(styles2.saveHidden);
			inputElement.disabled= true;
			selectedSlot = "";
			removeHighlightedSlotStyles();
			okBtn.disabled = false;
			cancelBtn.disabled = false;
		}, timer + 500);
		
	}


	useEffect( () => {
		return () => {
			clearTimeout(slotsHighlightAnimTimeout);
			clearTimeout(inputHighlightAnimTimeout);
			clearTimeout(newSlotTextAnimTimeout);
			clearTimeout(saveGameDialogCloseTiemout);
		};
	});


	return (
		<div className={styles.saveGameContentContainer} >
			<p className={styles.mainText}>
				Select a slot
			</p>

			{loadExistingGameNames()}

			<input className={styles.input} type="text"inputMode="text" id="userInput" placeholder="Enter new name" maxLength={15} onKeyDown={handleEnterKeyPress} disabled></input>

			<div className={styles.btnsContainer}>
				<button className={styles.btnSaveGame} type="button" onClick={handleConfirmSaveGame} id="btnOk">
					Ok
					<div className={styles.leftFormatter} ></div>
					<div className={styles.rigthFormatter} ></div>
				</button>

				<button className={styles.btnCancelSave} type="button" onClick={handleCancelSaveGame} id="btnCancel">
					Cancel
					<div className={styles.leftFormatter} ></div>
					<div className={styles.rigthFormatter} ></div>
				</button>
			</div>
		</div>
	);
}

export default SaveGame;
