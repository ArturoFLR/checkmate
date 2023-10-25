import { useGameStateContext } from "../context/GameStateContext";
import styles from "./PlayerData.module.scss";
import styles2 from "./Board.module.scss";
import { player1Data, player2Data } from "../globals/playersData";
import generateSquares from "../utils/generateSquares";
import { piecesData } from "../globals/gameData";
import generatePieces from "../utils/generatePieces.mts";


function PlayerData() {
	const [, gameStateData] = useGameStateContext();
	const howManyPlayers = gameStateData.gameState;
	const setGameState = gameStateData.setGameState;
	
	const squaresToClean = generateSquares(piecesData.pieces, false);

	function handleExitGameClick () {
		const exitGameDialog = document.getElementById("exitConfirmMainContainer");
		exitGameDialog?.classList.remove(styles.hidden);
	}

	function handleConfirmExitGame () {

		squaresToClean.map( (element) => {
			const square = document.getElementById(element.props.id) as HTMLDivElement;
			square.classList.remove(styles2.targetSquareWithPiece);
			square.classList.remove(styles2.targetEmptySquare);
		});

		piecesData.setPieces(generatePieces());

		setGameState("preGame");
	}

	function handleCancelExitGame () {
		const exitGameDialog = document.getElementById("exitConfirmMainContainer");
		exitGameDialog?.classList.add(styles.hidden);
	}


	return (
		<div className={styles.mainContainer}>
			{
				howManyPlayers === "gameStarted1P" || howManyPlayers === "gameIntro1P"
					? (
						<div className={styles.computerContainer} >
							<p>Computer</p>
							<img alt="Computer portrait" src="../../public/images/portraits/Robot2.jpg" /> 
						</div>
					)
					: (
						<div className={styles.player2Container} >
							<p>{player2Data.name}</p>
							<img alt="Player 2 portrait" src={player2Data.portrait} />
						</div>
					)
			}

			<div className={styles.player1Container} >
				<p>{player1Data.name}</p>
				<img alt="Player 1 portrait" src={player1Data.portrait} />
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
