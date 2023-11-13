import { useEffect, useState } from "react";
import styles from "./SelectPlayer.module.scss";
import Slideshow from "./Slideshow";
import { useGameStateContext } from "../context/GameStateContext";
import { player1Data, player2Data } from "../globals/playersData";

type playerDataToShow = "player1" | "player2";


function SelectPlayer () {					
	const [ playerDataToShow, setPlayerDataToShow ] = useState<playerDataToShow>("player1");		// This state changes the player data form displayed, player 1 or player 2

	const [, gameStateData] = useGameStateContext();
	const howManyPlayers = gameStateData.gameState;													// The "howManyPlayers" prop is used to decide whether or not to ask to fill in player 2's data when player 1's data has been filled in. "setGameState" changes App`s GameState
	const setGameState = gameStateData.setGameState;									

	let inputNameErrorTimeout: number;

	function handleP1EnterKeyPress (event: React.KeyboardEvent<HTMLInputElement>): void {
		if (event.key === "Enter") {
			handlePlayer1OkClick();
		}
	}

	function handleP2EnterKeyPress (event: React.KeyboardEvent<HTMLInputElement>): void {
		if (event.key === "Enter") {
			handlePlayer2OkClick();
		}
	}

	function animateInputOnError () {
		const player1NameInput = document.getElementById("playerInfoInput") as HTMLInputElement;
		player1NameInput.classList.add(styles.animateInputOnError);
		inputNameErrorTimeout = setTimeout( () => {
			player1NameInput.classList.remove(styles.animateInputOnError);
		}, 501);
	}

	function handlePlayer1OkClick () {
		const player1NameInput = document.getElementById("playerInfoInput") as HTMLInputElement;
		
		if (player1NameInput.value) {
			const player1Name = player1NameInput.value;

			const player1Portrait = player1Data.portrait;
			player1Data.changePlayerData(player1Name, player1Portrait);		// 	The "SelectPlayer" component only sets the name of the players in the "PlayersDataContext" context. The child component "Slideshow" is responsible for setting the portraits.

			player1NameInput.value = "";
			
			if (howManyPlayers === "select1Player") {
				player2Data.changePlayerData("Computer", "images/portraits/Robot2.jpg");
				setGameState("gameIntro1P");													// If there is only one player, changes the state of the parent component "App" to start the game
			} else if (howManyPlayers === "select2Players") {
				setPlayerDataToShow("player2");													// If there are two players, changes the state of this component to ask for player 2´s data.
			}

		} else {
			animateInputOnError();
		}
	}

	function handlePlayer2OkClick () {
		const player2NameInput = document.getElementById("playerInfoInput") as HTMLInputElement;
		
		if (player2NameInput.value) {
			const player2Name = player2NameInput.value;

			const player2Portrait = player2Data.portrait;
			player2Data.changePlayerData(player2Name, player2Portrait);
			
			setGameState("gameIntro2P");
		} else {
			animateInputOnError();
		}
	}

	useEffect( () => {
		return () => {
			clearTimeout(inputNameErrorTimeout);
		};
	});

	if (playerDataToShow === "player1") {
		return (
			<div className={styles.mainContainer} >
				<div className={styles.playerInfoContainer} >
					<div className={styles.playerNumberAndPieceContainer} >
						<p className={styles.playerInfoNumber} >Player 1</p>
						<img alt="White king" src="images/pieces/kingW.png" ></img>
					</div>

					<div className={styles.slideshowContainer} >
						<Slideshow  player="p1"/ >
					</div>

					<input className={styles.playerInfoInput} maxLength={10} id="playerInfoInput" placeholder="Enter your name" onKeyDown={handleP1EnterKeyPress}></input>
					<button type="button" className={styles.playerInfobtnOk} onClick={handlePlayer1OkClick}>Ok!</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className={styles.mainContainer} >
				<div className={styles.playerInfoContainer} >
					<div className={styles.playerNumberAndPieceContainer}>
						<p className={styles.playerInfoNumber} >Player 2</p>
						<img alt="White king" src="images/pieces/kingB.png"></img>
					</div>

					<div className={styles.slideshowContainer} >
						<Slideshow  player="p2"/ >
					</div>

					<input className={styles.playerInfoInput} maxLength={10} id="playerInfoInput" placeholder="Enter your name" onKeyDown={handleP2EnterKeyPress}></input>
					<button type="button" className={styles.playerInfobtnOk} onClick={handlePlayer2OkClick} >Ok!</button>
				</div>
			</div>
		);
	}
}

export default SelectPlayer;
