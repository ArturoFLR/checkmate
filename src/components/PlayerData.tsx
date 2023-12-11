import { useGameStateContext } from "../context/GameStateContext";
import styles from "./PlayerData.module.scss";
import { player1Data, player2Data } from "../globals/playersData";
import { isAIGameData, piecesData } from "../globals/gameData";
import { resetGameState } from "../utils/resetGameState";
import generateSquares from "../utils/generateSquares";
import SaveGame from "./SaveGame";


function PlayerData () {
	const [playerTurnData, gameStateData] = useGameStateContext();
	const {gameState, setGameState} = gameStateData;
	const playerTurn = playerTurnData.playerTurn;
	const setPlayerTurn = playerTurnData.setPlayerTurn;
	
	const squaresToClean = generateSquares(piecesData.pieces, false);

	let player1HighlightedClass: string;
	let player2HighlightedClass: string;

	if (playerTurn === "w") {
		player1HighlightedClass = styles.playerHighlighted;
		player2HighlightedClass = styles.playerNoHighlight;
	} else {
		player1HighlightedClass = styles.playerNoHighlight;
		player2HighlightedClass = styles.playerHighlighted;
	}

	let isAnyPlayerChecked = false;															// Used in the "generateDialogVisibility" function. Indicates if there is a king in check.

	piecesData.pieces.map( (element) => {
		if ((element.id[0] === "k" || element.id[0] === "K" ) && element.isCheck) isAnyPlayerChecked = true;
	});



	function generateDialogVisibility () {													// It is used to control the visibility of the AI speech bubbles, returning ".dialogHide" or "null" as a class.
		let dialogClass: string | null = styles.dialogHidden;

		if ((gameState === "gameStarted1P" && isAnyPlayerChecked) || ((gameState === "gameWinP1" || gameState === "gameWinP2") && isAIGameData.isAIGame)) {
			dialogClass = null;
		}

		return dialogClass;
	}


	function generateAiEmojis () {															// It is used to generate the AI speech bubbles, returning different animated gifs.
		let aiChecked = false;
		let playerChecked = false;

		piecesData.pieces.map( (element) => {
			if (element.id[0] === "k" && element.isCheck) aiChecked = true;
			if (element.id[0] === "K" && element.isCheck) playerChecked = true;
		});

		if ((playerChecked && !aiChecked) || gameState === "gameWinP2") {
			return (

				<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/laughing.gif" />

			);
		} else if (aiChecked) {
			return (

				<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/worried.gif" />

			);
		} else if (gameState === "gameWinP1") {
			return (

				<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/weeping.gif" />

			);
		}
	}

	function handleExitGameClick () {
		const exitGameDialog = document.getElementById("exitGame") as HTMLDivElement;
		exitGameDialog.classList.remove(styles.hidden);
	}

	function handleConfirmExitGame () {
		resetGameState(squaresToClean);																	// This function is in the "utils" folder.
		setPlayerTurn("w");
		setGameState("preGame");
	}

	function handleCancelExitGame () {
		const exitGameDialog = document.getElementById("exitGame") as HTMLDivElement;
		exitGameDialog.classList.add(styles.hidden);
	}

	function handleSaveGameClick () {
		const saveGameDialog = document.getElementById("saveGame") as HTMLDivElement;
		saveGameDialog.classList.remove(styles.saveHidden);
	}


	return (
		<div className={styles.mainContainer}>

			<div className={`${styles.player2Container} ${player2HighlightedClass}`} >
				<p>{player2Data.name}</p>
				<img alt="Player 2 portrait" src={player2Data.portrait} />

				<div className={`${styles.dialogContainer} ${generateDialogVisibility()}`} id="normalDialog">
					{generateAiEmojis()}
				</div>

				{/* The following div is used to display the AI's "loading" dialog. Its visibility is controlled from the "Board" component, since there is no specific state for "loading". */}

				<div className={`${styles.dialogLoadingContainer} ${styles.dialogContainer} ${styles.dialogHidden}`} id="loadingDialog">	
					<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/loading.gif" />
				</div>

			</div>

			<div className={`${styles.player1Container} ${player1HighlightedClass}`} >
				<p>{player1Data.name}</p>
				<img alt="Player 1 portrait" src={player1Data.portrait} />
			</div>

			<div className={styles.btnExitSaveGameContainer}>
				<button type="button" onClick={handleSaveGameClick} className={styles.btnSaveGame}>
					Save Game
				</button>

				<button type="button" onClick={handleExitGameClick} className={styles.btnExitGame}>
					Exit Game
				</button>

				<div className={styles.leftFormatter} ></div>
				<div className={styles.rigthFormatter} ></div>
			</div>

			<div className={`${styles.exitConfirmMainContainer} ${styles.hidden}`} id="exitGame">
				<div className={styles.exitConfirmOptionsContainer} >
					<p>Do you really want to quit?</p>

					<button className={styles.btnExitGame} type="button" onClick={handleConfirmExitGame}>
						Yes
					</button>

					<button className={styles.btnExitGame} type="button" onClick={handleCancelExitGame}>
						No
					</button>
				</div>
			</div>
			
			<div className={`${styles.saveGameContainer} ${styles.saveHidden}`} id="saveGame">				{/* It is made visible by the "PlayerData" component, and made invisible again by the "SaveGame" component. */}		
				<SaveGame />		
			</div>

		</div>
	);
}

export default PlayerData;
