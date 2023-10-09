import { useState } from "react";
import styles from "./App.module.scss";
import MainMenu from "./components/MainMenu";
import Board from "./components/Board";
import SelectPlayer from "./components/SelectPlayer";

type GameState = "preGame" | "selectPlayer" | "gameStarted";

function App() {

	const [gameState, setGameState] = useState<GameState>("preGame");

	return (
		<div className={styles.mainContainer}>
			{
				gameState === "selectPlayer"
					? <SelectPlayer />
					: null
			}
			<main className={styles.gameZoneContainer}>
				<div className={styles.boardContainer}>
					<Board />
				</div>
			</main>

			<header className={styles.headerContainer}>
				<div className={styles.logoContainer}>
					<h1>CHECKMATE!</h1>
				</div>

				<div className={styles.menuContainer}>
					<MainMenu />
				</div>
			</header>
		</div>
	);
}

export default App;
