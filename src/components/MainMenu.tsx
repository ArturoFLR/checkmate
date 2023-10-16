import { useState } from "react";
import styles from "./MainMenu.module.scss";
import { GameState } from "../App";

type OptionSelected = "init" | "load" | "new";

type MainMenuProps = {
	setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

function MainMenu( {setGameState}: MainMenuProps) {

	const [optionSelected, setOptionSelected] = useState<OptionSelected>("init");

	function handleNewGameClick () {
		setOptionSelected("new");
	}

	function handleLoadGameClick () {
		if (optionSelected !== "load") {
			setOptionSelected("load");
		} else {
			setOptionSelected("init");
		}
	}

	function handlePlayerVsComputerClick () {
		setGameState("select1Player");
	}

	function handle2Players () {
		setGameState("select2Players");
	}

	function handleBackClick () {
		setOptionSelected("init");
	}

	if (optionSelected === "init") {
		return (
			<div className={styles.mainContainer} >
				<div className={styles.newGameContainer}>
					<button type="button" className={styles.btnNewGame} onClick={handleNewGameClick} >NEW GAME</button>
				</div>
	
				<div className={styles.loadGameContainer}>
					<button type="button" className={styles.btnLoadGame} onClick={handleLoadGameClick} >LOAD GAME</button>
				</div>

				<div className={styles.leftFormatter} ></div>
				<div className={styles.rigthFormatter} ></div>
			</div>
		);
	} else if (optionSelected === "load") {
		return (
			<div className={styles.mainContainer} >
				<div className={styles.newGameContainer}>
					<button type="button" className={styles.btnNewGame} onClick={handleNewGameClick} >NEW GAME</button>
				</div>
	
				<div className={styles.loadGameContainer}>
					<button type="button" className={styles.btnLoadGame} onClick={handleLoadGameClick} >LOAD GAME</button>
					<div className={styles.loadGameGameList}>
						<p>Partida 1.</p>
						<p>Partida 2.</p>
						<p>Partida 3.</p>
					</div>
					<button type="button" className={styles.btnSelect}>Select</button>
				</div>

				<div className={styles.leftFormatter} ></div>
				<div className={styles.rigthFormatter} ></div>
			</div>
		);
	} else if (optionSelected === "new") {
		return (
			<div className={styles.mainContainer} >
				<div className={styles.playerVsComputerContainer} >
					<button type="button" className={styles.btnPlayerVsComputer} onClick={handlePlayerVsComputerClick} >PLAYER VS COMPUTER</button>
				</div>

				<div className={styles.onePlayerContainer} > 
					<button type="button" className={styles.btnOnePlayer} onClick={handle2Players} >2 PLAYERS</button>
				</div>

				<div className={styles.backContainer} >
					<button type="button" className={styles.btnBack} onClick={handleBackClick} >BACK</button>
				</div>

				<div className={styles.leftFormatter} ></div>
				<div className={styles.rigthFormatter} ></div>
			</div>
		);
	}

}

export default MainMenu;