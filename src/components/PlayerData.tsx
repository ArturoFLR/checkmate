import { GameState } from "../App";
import { usePlayersDataContext } from "../context/PlayersContext";
import styles from "./PlayerData.module.scss";

type SelectPlayerProps = {
	howManyPlayers: GameState,
	setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

function PlayerData( {howManyPlayers, setGameState}: SelectPlayerProps ) {
	const playersData = usePlayersDataContext();

	function handleExitGameClick () {
		const exitGameDialog = document.getElementById("exitConfirmMainContainer");
		exitGameDialog?.classList.remove(styles.hidden);
	}

	function handleConfirmExitGame () {
		setGameState("preGame");
	}

	function handleCancelExitGame () {
		const exitGameDialog = document.getElementById("exitConfirmMainContainer");
		exitGameDialog?.classList.add(styles.hidden);
	}


	return (
		<div className={styles.mainContainer}>
			{
				howManyPlayers === "gameStarted1P"
					? (
						<div className={styles.computerContainer} >
							<p>Computer</p>
							<img alt="Computer portrait" src="../../public/images/portraits/Robot2.jpg" /> 
						</div>
					)
					: (
						<div className={styles.player2Container} >
							<p>{playersData[1].name}</p>
							<img alt="Player 2 portrait" src={playersData[1].portrait} />
						</div>
					)
			}

			<div className={styles.player1Container} >
				<p>{playersData[0].name}</p>
				<img alt="Player 1 portrait" src={playersData[0].portrait} />
			</div>

			<div className={styles.btnExitGameContainer}>
				<button type="button" onClick={handleExitGameClick} className={styles.btnExitGame}>
					Exit Game
					<div className={styles.leftFormatter} ></div>
					<div className={styles.rigthFormatter} ></div>
				</button>
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
		</div>
	);
}

export default PlayerData;
