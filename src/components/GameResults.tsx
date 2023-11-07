import { useGameStateContext } from "../context/GameStateContext";
import { player1Data, player2Data } from "../globals/playersData";
import styles from "./GameResults.module.scss";

function GameResults() {
	const [, gameStateData] = useGameStateContext();
	const {gameState, setGameState} = gameStateData;

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

								<img alt="fireworks" className={styles.fireworkBig} src ="../../public/images/fireworks/big_air.gif"></img>
								<img alt="fireworks" className={styles.fireworkSmall} src ="../../public/images/fireworks/small_air.gif"></img>
								<img alt="fireworks" className={styles.fireworkGround} src ="../../public/images/fireworks/ground.gif"></img>
							</div>

							<div className={styles.winnerNameContainer}>

							</div>	


						</div>
					)
					: (
						<>
							<div className={styles.player1Container}> 

							</div>

							<div className={styles.player2Container}> 

							</div>

							<div className={styles.drawTitleContainer}> 

							</div>	
						</>
					)
			}
		</div>
	);
}

export default GameResults;
