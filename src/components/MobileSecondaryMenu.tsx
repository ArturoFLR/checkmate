import { useGameStateContext } from "../context/GameStateContext";
import { piecesData } from "../globals/gameData";
import generateSquares from "../utils/generateSquares";
import { resetGameState } from "../utils/resetGameState";
import styles from "./MobileSecondaryMenu.module.scss";
import styles2 from "./MainMenuMobile.module.scss";
import SaveGameMobile from "./SaveGameMobile";

function MobileSecondaryMenu() {

	const [playerTurnData, gameStateData] = useGameStateContext();
	const {setGameState} = gameStateData;
	const setPlayerTurn = playerTurnData.setPlayerTurn;
	const squaresToClean = generateSquares(piecesData.pieces, false);

	function handleExitGameClick () {
		const exitGameDialog = document.getElementById("exitGameMobile") as HTMLDivElement;
		exitGameDialog.classList.remove(styles.hidden);
	}

	function handleConfirmExitGame () {
		const mobileMenu = document.getElementById("mobileMainMenuContainer") as HTMLDivElement;
		mobileMenu.classList.add(styles2.hide);

		resetGameState(squaresToClean);																	// This function is in the "utils" folder.
		setPlayerTurn("w");
		setGameState("preGame");
	}

	function handleCancelExitGame () {
		const exitGameDialog = document.getElementById("exitGameMobile") as HTMLDivElement;
		exitGameDialog.classList.add(styles.hidden);
	}

	function handleSaveGameClick () {
		const saveGameDialog = document.getElementById("saveGameMobile") as HTMLDivElement;
		saveGameDialog.classList.remove(styles.saveHidden);
	}

	return (
		<div>

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

			<div className={`${styles.exitConfirmMainContainer} ${styles.hidden}`} id="exitGameMobile">
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
			
			<div className={`${styles.saveGameContainer} ${styles.saveHidden}`} id="saveGameMobile">				{/* It is made visible by the "PlayerData" component, and made invisible again by the "SaveGame" component. */}		
				<SaveGameMobile />		
			</div>

		</div>
	);
}

export default MobileSecondaryMenu;
