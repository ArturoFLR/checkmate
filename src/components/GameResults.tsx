import { useGameStateContext } from "../context/GameStateContext";
import { piecesData } from "../globals/gameData";
import { player1Data, player2Data } from "../globals/playersData";
import generateSquares from "../utils/generateSquares";
import { resetGameState } from "../utils/resetGameState";
import styles from "./GameResults.module.scss";

function GameResults() {
	const [playerTurnData, gameStateData] = useGameStateContext();
	const setPlayerTurn = playerTurnData.setPlayerTurn;
	const {gameState, setGameState} = gameStateData;
	const squaresToClean = generateSquares(piecesData.pieces, false);

	function handleContinueClick () {
		resetGameState(squaresToClean);
		setPlayerTurn("w");
		setGameState("preGame");
	}


	return (
		<div className={styles.mainContainer}>
			{
				gameState === "gameWinP1" || gameState === "gameWinP2"
					? (
						<div className={styles.winnerContainer}> 
							<div className={styles.winnerPortraitContainer}>
								{
									gameState === "gameWinP1"
										? <img className={styles.winnerPortrait} alt="Player portrait" src={player1Data.portrait} ></img>
										: <img className={styles.winnerPortrait} alt="Player portrait" src={player2Data.portrait} ></img>
								}

								<img alt="fireworks" className={`${styles.fireworkGround} ${styles.firework}`} src ="images/fireworks/ground.gif"></img>
								<img alt="fireworks" className={`${styles.fireworkGround2} ${styles.firework}`} src ="images/fireworks/ground.gif"></img>
							</div>

							<div className={styles.winnerNameContainer}>
								{
									gameState === "gameWinP1"
										? (
											<>
												<p className={styles.winnerName}>{player1Data.name + " "}</p>
												<p className={styles.winsText}>¡GANA!</p>
											</>
										)
										: (
											<>
												<p className={styles.winnerName}>{player2Data.name + " "}</p>
												<p className={styles.winsText}>¡GANA!</p>
											</>
										)
								}

							</div>

							<button type="button" className={styles.btnContinue} onClick={handleContinueClick}>Continuar</button>	
						</div>
					)
					: (
						<div className={styles.drawContainer}>

							<div className={styles.playersContainer}>

								<div className={styles.player1Container}> 
									<img className={styles.player1Portrait} alt="Player portrait" src={player1Data.portrait} ></img>
									<img className={styles.sparks} alt="Sparks" src="images/otheranims/sparks.gif" ></img>
								</div>

								<div className={styles.player2Container}> 
									<img className={styles.player2Portrait} alt="Player portrait" src={player2Data.portrait} ></img>
								</div>

							</div>

							<div className={styles.drawTitleContainer}> 
								<p className={styles.drawText} >Tablas</p>

								{
									gameState === "gameDraw50Moves"
										? <p className={styles.drawTypeText} >-Regla 50 Movimientos-</p>
										: null
								}

								{
									gameState === "gameDrawStalemate"
										? <p className={styles.drawTypeText} >-Ahogado-</p>
										: null
								}

								{
									gameState === "gameDrawDeadPosition"
										? <p className={styles.drawTypeText} >-Material Insuficiente-</p>
										: null
								}

								{
									gameState === "gameDrawThreefoldRepetition"
										? <p className={styles.drawTypeText} >-Triple Repetición-</p>
										: null
								}
							</div>

							<button type="button" className={styles.btnContinue} onClick={handleContinueClick}>Continuar</button>	
						</div>
					)
			}
		</div>
	);
}

export default GameResults;
