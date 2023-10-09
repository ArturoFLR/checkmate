import { useState } from "react";
import styles from "./MainMenu.module.scss";

type OptionSelected = "init" | "load" | "new";

function MainMenu() {

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
						Partida 1.
						Partida 2.
						Partida 3.
					</div>
					<button type="button">Select</button>
				</div>
			</div>
		);
	} else if (optionSelected === "new") {
		return (
			<div className={styles.mainContainer} >
				<div className={styles.playerVsComputerContainer} >
					<button type="button" className={styles.btnPlayerVsComputer}>PLAYER VS COMPUTER</button>
				</div>

				<div className={styles.onePlayerContainer} > 
					<button type="button" className={styles.btnOnePlayer}>1 PLAYER</button>
				</div>

				<div className={styles.backContainer} >
					<button type="button" className={styles.btnPlayerVsComputer} onClick={handleBackClick} >BACK</button>
				</div>

			</div>
		);
	}

}

export default MainMenu;