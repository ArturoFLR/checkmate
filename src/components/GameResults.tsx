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

								<img alt="fireworks" className={`${styles.fireworkGround} ${styles.firework}`} src ="../../public/images/fireworks/ground.gif"></img>
								<img alt="fireworks" className={`${styles.fireworkGround2} ${styles.firework}`} src ="../../public/images/fireworks/ground.gif"></img>
							</div>

							<div className={styles.winnerNameContainer}>
								{
									gameState === "gameWinP1"
										? (
											<>
												<p className={styles.winnerName}>{player1Data.name + " "}</p>
												<p className={styles.winsText}>WINS!</p>
											</>
										)
										: (
											<>
												<p className={styles.winnerName}>{player2Data.name + " "}</p>
												<p className={styles.winsText}>WINS!</p>
											</>
										)
								}

							</div>

							<button type="button" className={styles.btnContinue} onClick={handleContinueClick}>Continue</button>	
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
								<p className={styles.drawText} >Draw!</p>

								{
									gameState === "gameDraw50Moves"
										? <p className={styles.drawTypeText} >-50 Moves Rule-</p>
										: null
								}

								{
									gameState === "gameDrawStalemate"
										? <p className={styles.drawTypeText} >-Stalemate-</p>
										: null
								}

								{
									gameState === "gameDrawDeadPosition"
										? <p className={styles.drawTypeText} >-Dead Position-</p>
										: null
								}

								{
									gameState === "gameDrawThreefoldRepetition"
										? <p className={styles.drawTypeText} >-Threefold Repetition-</p>
										: null
								}
							</div>

							<button type="button" className={styles.btnContinue} onClick={handleContinueClick}>Continue</button>	
						</div>
					)
			}
		</div>
	);
}

export default GameResults;
