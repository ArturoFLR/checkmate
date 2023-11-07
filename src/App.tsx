import styles from "./App.module.scss";
import MainMenu from "./components/MainMenu";
import Board from "./components/Board";
import SelectPlayer from "./components/SelectPlayer";
import PlayerData from "./components/PlayerData";
import Logo from "./components/Logo";
import PiecesInit from "./components/PiecesInit";
import { useGameStateContext } from "./context/GameStateContext";

function App() {

	const [, gameStateData] = useGameStateContext();
	const gameState = gameStateData.gameState; 					//  Tells the App component what phase the game is in, so it can render the appropriate child  components.

	return (
		<div className={styles.mainContainer}>
			{
				gameState === "select1Player" || gameState === "select2Players"
					? <SelectPlayer />
					: null
			}
			<main className={styles.gameZoneContainer}>
				{
					gameState === "preGame" || gameState === "select1Player" || gameState === "select2Players" || gameState === "gameIntro1P" || gameState === "gameIntro2P"
						? (
							<div className={styles.BlackPiecesInitContainer}>
																	
								{
									gameState === "gameIntro1P" || gameState === "gameIntro2P"
										? <PiecesInit animate={true} piecesColor="black"/>
										: <PiecesInit animate={false} piecesColor="black"/>
								}
								
							</div>
						)	
						: null					
				}


				<div className={styles.boardContainer}>
					{
						gameState !== "preGame" && gameState !== "select1Player" && gameState !== "select2Players" && gameState !== "gameIntro1P" && gameState !== "gameIntro2P"
							? 	<Board  showPieces={true}/>
							: 	<Board  showPieces={false}/>
					}

				</div>

				{
					gameState === "preGame" || gameState === "select1Player" || gameState === "select2Players" || gameState === "gameIntro1P" || gameState === "gameIntro2P"
						? (
							<div className={styles.WhitePiecesInitContainer}>
																	
								{
									gameState === "gameIntro1P" || gameState === "gameIntro2P"
										? <PiecesInit animate={true} piecesColor="white" />
										: <PiecesInit animate={false} piecesColor="white" />
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
						gameState !== "preGame" && gameState !== "select1Player" && gameState !== "select2Players"
							? <PlayerData /> 
							: <MainMenu />
					}
						
				</div>
			</header>
		</div>
	);
}

export default App;
