import { useState } from "react";
import styles from "./App.module.scss";
import MainMenu from "./components/MainMenu";
import Board from "./components/Board";
import SelectPlayer from "./components/SelectPlayer";
import PlayerData from "./components/PlayerData";
import Logo from "./components/Logo";
import PiecesInit from "./components/PiecesInit";

export type GameState = "preGame" | "select1Player" | "select2Players" | "gameIntro1P" | "gameIntro2P" | "gameStarted1P" | "gameStarted2P";

function App() {

	const [gameState, setGameState] = useState<GameState>("preGame");		//  Tells the App component what phase the game is in, so it can render the appropriate child  components.

	return (
		<div className={styles.mainContainer}>
			{
				gameState === "select1Player" || gameState === "select2Players"
					? <SelectPlayer howManyPlayers={gameState} setGameState={setGameState} />
					: null
			}
			<main className={styles.gameZoneContainer}>
				{
					gameState !== "gameStarted1P" && gameState !== "gameStarted2P"
						? (
							<div className={styles.BlackPiecesInitContainer}>
																	
								{
									gameState === "gameIntro1P" || gameState === "gameIntro2P"
										? <PiecesInit setGameState={setGameState} gameState={gameState} animate={true} piecesColor="black"/>
										: <PiecesInit setGameState={setGameState} gameState={gameState} animate={false} piecesColor="black"/>
								}
								
							</div>
						)	
						: null					
				}


				<div className={styles.boardContainer}>
					{
						gameState === "gameStarted1P" || gameState === "gameStarted2P"
							? 	<Board  showPieces={true}/>
							: 	<Board  showPieces={false}/>
					}

				</div>

				{
					gameState !== "gameStarted1P" && gameState !== "gameStarted2P"
						? (
							<div className={styles.WhitePiecesInitContainer}>
																	
								{
									gameState === "gameIntro1P" || gameState === "gameIntro2P"
										? <PiecesInit setGameState={setGameState} gameState={gameState} animate={true} piecesColor="white" />
										: <PiecesInit setGameState={setGameState} gameState={gameState} animate={false} piecesColor="white" />
								}
								
							</div>
						)	
						: null					
				}

			</main>

			<header className={styles.headerContainer}>
				<div className={styles.logoContainer}>
					<Logo />
				</div>

				<div className={styles.menuContainer}>
					{
						gameState === "gameIntro1P" || gameState === "gameIntro2P" || gameState === "gameStarted1P" || gameState === "gameStarted2P"
							? <PlayerData howManyPlayers={gameState} setGameState={setGameState} /> 
							: <MainMenu setGameState={setGameState} />
					}
						
				</div>
			</header>
		</div>
	);
}

export default App;
