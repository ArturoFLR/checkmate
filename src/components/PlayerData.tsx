import { GameState } from "../App";
import styles from "./PlayerData.module.scss";

type SelectPlayerProps = {
	howManyPlayers: GameState
}

function PlayerData( {howManyPlayers}: SelectPlayerProps ) {
	return (
		<div className={styles.mainContainer}>
			{
				howManyPlayers === "gameStarted1P"
					? <div> </div>
					: <div> </div>
			}
		</div>
	);
}

export default PlayerData;
