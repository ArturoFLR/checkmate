import { useGameStateContext } from "../context/GameStateContext";
import styles from "./PlayerData.module.scss";
import { player1Data, player2Data } from "../globals/playersData";
import { piecesData } from "../globals/gameData";
import { resetGameState } from "../utils/resetGameState";
import generateSquares from "../utils/generateSquares";


function PlayerData() {
	const [playerTurnData, gameStateData] = useGameStateContext();
	const setGameState = gameStateData.setGameState;
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

	function handleExitGameClick () {
		const exitGameDialog = document.getElementById("exitConfirmMainContainer");
		exitGameDialog?.classList.remove(styles.hidden);
	}

	function handleConfirmExitGame () {
		resetGameState(squaresToClean);
		setPlayerTurn("w");
		setGameState("preGame");
	}

	function handleCancelExitGame () {
		const exitGameDialog = document.getElementById("exitConfirmMainContainer");
		exitGameDialog?.classList.add(styles.hidden);
	}


	return (
		<div className={styles.mainContainer}>

			<div className={`${styles.player2Container} ${player2HighlightedClass}`} >
				<p>{player2Data.name}</p>
				<img alt="Player 2 portrait" src={player2Data.portrait} />
			</div>

			<div className={`${styles.player1Container} ${player1HighlightedClass}`} >
				<p>{player1Data.name}</p>
				<img alt="Player 1 portrait" src={player1Data.portrait} />
			</div>

			<div className={styles.btnExitGameContainer}>
				<button type="button" onClick={handleExitGameClick} className={styles.btnSaveGame}>
					Save Game
				</button>
			</div>

			<div className={styles.btnExitGameContainer}>
				<button type="button" onClick={handleExitGameClick} className={styles.btnExitGame}>
					Exit Game
				</button>
			</div>

			<div className={styles.leftFormatter} ></div>
			<div className={styles.rigthFormatter} ></div>

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
		</div>
	);
}

export default PlayerData;
