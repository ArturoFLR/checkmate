import styles from "./Slideshow.module.scss";
import portraitsPaths from "../data/portraitsPaths";
import { useEffect, useState } from "react";
import { player1Data, player2Data } from "../globals/playersData";

type SlideshowProps = {
	player: "p1" |"p2"
}

function Slideshow( {player}: SlideshowProps ) {							//	The "player" prop indicates which player is selecting their portrait.
	const [ actualPortraitIndex, setActualPortraitIndex ] = useState(0);
	let actualPortraitPath: string;
	
	let noSelectedPortraitsPaths = portraitsPaths; 			// Later, this variable will be defined as "portraitsPaths" minus the portrait already selected by player 1, if any
	
	let prevPortraitPath: string;		// 	These variables will be defined later, within "if" statements.
	let nextPortraitPath: string;		
	let nextPortraitTimeout: number;	
	let prevPortraitTimeout: number;


	if ( player === "p2" ) {							// If player 2 (p2) is selecting his / her portrait, the portrait already selected by player 1 (playersData[0].portrait) will be removed from the array of available portraits for player 2.
		const noSelectedPortraitsPathsCopy = [...noSelectedPortraitsPaths];

		const pathToDeleteIndex = noSelectedPortraitsPathsCopy.findIndex( (element) => {
			return element === player1Data.portrait;
		});

		noSelectedPortraitsPathsCopy.splice(pathToDeleteIndex, 1);
		noSelectedPortraitsPaths = noSelectedPortraitsPathsCopy;
	} 

	if ( actualPortraitIndex > noSelectedPortraitsPaths.length - 1) {				// 		If player 1 chose the last portrait from the "noSelectedPortraitsPaths" array, "currentPortraitIndex" will be left with a value greater than the length of the array, causing errors for player 2. This code corrects this situation.
		actualPortraitPath = noSelectedPortraitsPaths[0];
		setActualPortraitIndex(0);
	} else {
		actualPortraitPath = noSelectedPortraitsPaths[actualPortraitIndex];
	}

	if (player === "p1") {												// Every time a portrait is chosen (the one that appears by default also counts) it is set as the one chosen by player 1 or 2 in the PlayersDataContext context
		player1Data.changePlayerData("", actualPortraitPath);
	} else {
		player2Data.changePlayerData("", actualPortraitPath);
	}

	if (actualPortraitIndex < (noSelectedPortraitsPaths.length - 1)) {						// 	Defines the initial portrait that contains the nextPortraitPath variable, based on the portrait that contains the currentPortraitIndex variable
		nextPortraitPath = noSelectedPortraitsPaths[actualPortraitIndex + 1];
	} else {
		nextPortraitPath = noSelectedPortraitsPaths[0];
	}

	if (actualPortraitIndex > 0) {															// 	Defines the initial portrait that contains the prevPortraitPath variable, based on the portrait that contains the currentPortraitIndex variable
		prevPortraitPath = noSelectedPortraitsPaths[actualPortraitIndex - 1];
	} else {
		prevPortraitPath = noSelectedPortraitsPaths[noSelectedPortraitsPaths.length - 1];
	}

	function handleNextPortrait () {
		const nextImageContainer = document.getElementById("nextImageContainer") as HTMLDivElement;
		nextImageContainer.classList.add(styles.animateNextPortrait);

		nextPortraitTimeout = window.setTimeout( () => {
			if (actualPortraitIndex < (noSelectedPortraitsPaths.length - 1)) {
				setActualPortraitIndex(actualPortraitIndex + 1);
			} else {
				setActualPortraitIndex(0);
			}

			nextImageContainer.classList.remove(styles.animateNextPortrait);
		}, 400);
	}

	function handlePrevPortrait () {
		const prevImageContainer = document.getElementById("prevImageContainer") as HTMLDivElement;
		prevImageContainer.classList.add(styles.animatePrevPortrait);

		prevPortraitTimeout = window.setTimeout( () => {
			if (actualPortraitIndex > 0) {
				setActualPortraitIndex(actualPortraitIndex - 1);
			} else {
				setActualPortraitIndex(noSelectedPortraitsPaths.length - 1);
			}

			prevImageContainer.classList.remove(styles.animatePrevPortrait);
		}, 400);
	}

	useEffect( () => {
		return () => {
			clearTimeout(nextPortraitTimeout);
			clearTimeout(prevPortraitTimeout);
		};
	});

	return (
		<div className={styles.mainContainer}>
			<div className={styles.imagesContainer}>
				<div className={styles.prevImageContainer} id="prevImageContainer">
					<img alt="Portrait" src={prevPortraitPath} />
				</div>

				<div className={styles.actualImageContainer}>
					<img alt="Portrait" src={actualPortraitPath} />
				</div>

				<div className={styles.nextImageContainer} id="nextImageContainer">
					<img alt="Portrait" src={nextPortraitPath} />
				</div>

				<div className={styles.nextIconContainer} onClick={handleNextPortrait} >
					<img alt="Next portrait" src="icons/icon-next.svg" />
				</div>

				<div className={styles.prevIconContainer} onClick={handlePrevPortrait} >
					<img alt="Previous portrait" src="icons/icon-previous.svg" />
				</div>
			</div>
		</div>
	);
}

export default Slideshow;
