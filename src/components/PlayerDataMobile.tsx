import { useGameStateContext } from "../context/GameStateContext";
import styles from "./PlayerDataMobile.module.scss";
import { player1Data, player2Data } from "../globals/playersData";
import { isAIGameData, piecesData } from "../globals/gameData";


function PlayerDataMobile () {
	const [playerTurnData, gameStateData] = useGameStateContext();
	const {gameState} = gameStateData;
	const playerTurn = playerTurnData.playerTurn;


	let player1HighlightedClass: string;
	let player2HighlightedClass: string;

	if (playerTurn === "w") {
		player1HighlightedClass = styles.playerHighlighted;
		player2HighlightedClass = styles.playerNoHighlight;
	} else {
		player1HighlightedClass = styles.playerNoHighlight;
		player2HighlightedClass = styles.playerHighlighted;
	}

	let isAnyPlayerChecked = false;															// Used in the "generateDialogVisibility" function. Indicates if there is a king in check.

	piecesData.pieces.map( (element) => {
		if ((element.id[0] === "k" || element.id[0] === "K" ) && element.isCheck) isAnyPlayerChecked = true;
	});



	function generateDialogVisibility () {													// It is used to control the visibility of the AI speech bubbles, returning ".dialogHide" or "null" as a class.
		let dialogClass: string | null = styles.dialogHidden;

		if ((gameState === "gameStarted1P" && isAnyPlayerChecked) || ((gameState === "gameWinP1" || gameState === "gameWinP2") && isAIGameData.isAIGame)) {
			dialogClass = null;
		}

		return dialogClass;
	}


	function generateAiEmojis () {															// It is used to generate the AI speech bubbles, returning different animated gifs.
		let aiChecked = false;
		let playerChecked = false;

		piecesData.pieces.map( (element) => {
			if (element.id[0] === "k" && element.isCheck) aiChecked = true;
			if (element.id[0] === "K" && element.isCheck) playerChecked = true;
		});

		if ((playerChecked && !aiChecked) || gameState === "gameWinP2") {
			return (

				<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/laughing.gif" />

			);
		} else if (aiChecked) {
			return (

				<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/worried.gif" />

			);
		} else if (gameState === "gameWinP1") {
			return (

				<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/weeping.gif" />

			);
		}
	}


	return (
		<div className={styles.mainContainer}>

			<div className={`${styles.player2Container} ${player2HighlightedClass}`} >
				<p>{player2Data.name}</p>
				<img alt="Retrato del jugador 2" src={player2Data.portrait} />

				<div className={`${styles.dialogContainer} ${generateDialogVisibility()}`} id="normalDialog">
					{generateAiEmojis()}
				</div>

				{/* The following div is used to display the AI's "loading" dialog. Its visibility is controlled from the "Board" component, since there is no specific state for "loading". */}

				<div className={`${styles.dialogLoadingContainer} ${styles.dialogContainer} ${styles.dialogHidden}`} id="loadingDialogMobile">	
					<img className={styles.dialogEmoji} alt="aiEmoji" src="images/emojis/loading.gif" />
				</div>

			</div>

			<div className={`${styles.player1Container} ${player1HighlightedClass}`} >
				<p>{player1Data.name}</p>
				<img alt="Retrato del jugador 1" src={player1Data.portrait} />
			</div>

		</div>
	);
}

export default PlayerDataMobile;
