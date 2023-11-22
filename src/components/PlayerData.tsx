import { useGameStateContext } from "../context/GameStateContext";
import styles from "./PlayerData.module.scss";
import { player1Data, player2Data } from "../globals/playersData";
import { isAIGameData, piecesData } from "../globals/gameData";
import { resetGameState } from "../utils/resetGameState";
import generateSquares from "../utils/generateSquares";
import SaveGame from "./SaveGame";


function PlayerData() {
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

	function generateAiEmojis () {
		let aiChecked = false;
		let playerChecked = false;

		piecesData.pieces.map( (element) => {
			if (element.id[0] === "k" && element.isCheck) aiChecked = true;
			if (element.id[0] === "K" && element.isCheck) playerChecked = true;
		});

		if (gameState === "gameLoading" && !aiChecked) {
			return (
				<div className={styles.dialogContainer}>
					<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/loading.gif" />
				</div>
			);
		} else if (playerChecked && !aiChecked) {
			return (
				<div className={styles.dialogContainer}>
					<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/laughing.gif" />
				</div>
			);
		} else if (aiChecked) {
			return (
				<div className={styles.dialogContainer}>
					<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/worried.gif" />
				</div>
			);
		} else if (gameState === "gameWinP1") {
			return (
				<div className={styles.dialogContainer}>
					<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/weeping.gif" />
				</div>
			);
		}
	}

	function handleExitGameClick () {
		const exitGameDialog = document.getElementById("exitConfirmMainContainer") as HTMLDivElement;
		exitGameDialog.classList.remove(styles.hidden);
	}

	function handleConfirmExitGame () {
		resetGameState(squaresToClean);																	// This function is in the "utils" folder.
		setPlayerTurn("w");
		setGameState("preGame");
	}

	function handleCancelExitGame () {
		const exitGameDialog = document.getElementById("exitConfirmMainContainer") as HTMLDivElement;
		exitGameDialog.classList.add(styles.hidden);
	}

	function handleSaveGameClick () {
		const saveGameDialog = document.getElementById("saveGameMainContainer") as HTMLDivElement;
		saveGameDialog.classList.remove(styles.saveHidden);
	}


	return (
		<div className={styles.mainContainer}>

			<div className={`${styles.player2Container} ${player2HighlightedClass}`} >
				<p>{player2Data.name}</p>
				<img alt="Player 2 portrait" src={player2Data.portrait} />
				{
					gameState === "gameStarted1P" || gameState === "gameLoading" || (gameState === "gameWinP1" && isAIGameData.isAIGame)
						? generateAiEmojis()
						: null
				}
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

			<div className={`${styles.exitConfirmMainContainer} ${styles.hidden}`} id="exitConfirmMainContainer">
				<div className={styles.exitConfirmOptionsContainer} >
					<p>Do you really want to quit?</p>

					<button className={styles.btnExitGame} type="button" onClick={handleConfirmExitGame}>
						Yes
						<div className={styles.leftFormatter} ></div>
						<div className={styles.rigthFormatter} ></div>
					</button>

					<button className={styles.btnExitGame} type="button" onClick={handleCancelExitGame}>
						No
						<div className={styles.leftFormatter} ></div>
						<div className={styles.rigthFormatter} ></div>
					</button>
				</div>
			</div>
			
			<div className={`${styles.saveGameContainer} ${styles.saveHidden}`} id="saveGameMainContainer">				{/* It is made visible by the "PlayerData" component, and made invisible again by the "SaveGame" component. */}		
				<SaveGame />		
			</div>

		</div>
	);
}

export default PlayerData;
