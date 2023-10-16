import { useEffect, useState } from "react";
import { GameState } from "../App";
import styles from "./SelectPlayer.module.scss";
import Slideshow from "./Slideshow";
import { usePlayersDataContext } from "../context/PlayersContext";

type playerDataToShow = "player1" | "player2";

type SelectPlayerProps = {
	howManyPlayers: GameState,
	setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

function SelectPlayer( { howManyPlayers, setGameState }: SelectPlayerProps ) {					// 	The "howManyPlayers" prop is used to decide whether or not to ask to fill in player 2's data when player 1's data has been filled in. "setGameState" changes App`s GameState
	const [ playerDataToShow, setPlayerDataToShow ] = useState<playerDataToShow>("player1");		// This state changes the player data form displayed, player 1 or player 2
	const playersData = usePlayersDataContext();

	let inputNameErrorTimeout: number;

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

			const player1Portrait = playersData[0].portrait;
			playersData[0].changePlayerData(player1Name, player1Portrait);		// 	The "SelectPlayer" component only sets the name of the players in the "PlayersDataContext" context. The child component "Slideshow" is responsible for setting the portraits.

			player1NameInput.value = "";
			
			if (howManyPlayers === "select1Player") {
				setGameState("gameStarted1P");								// If there is only one player, changes the state of the parent component "App" to start the game
			} else if (howManyPlayers === "select2Players") {
				setPlayerDataToShow("player2");								// If there are two players, changes the state of this component to ask for player 2´s data.
			}

		} else {
			animateInputOnError();
		}
	}

	function handlePlayer2OkClick () {
		const player2NameInput = document.getElementById("playerInfoInput") as HTMLInputElement;
		
		if (player2NameInput.value) {
			const player2Name = player2NameInput.value;

			const player2Portrait = playersData[0].portrait;
			playersData[0].changePlayerData(player2Name, player2Portrait);
			
			setGameState("gameStarted2P");
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
					<div>
						<p className={styles.playerInfoNumber} >PLAYER 1</p>
						<img alt="White king" src="../../public/images/pieces/"></img>
					</div>

					<div className={styles.slideshowContainer} >
						<Slideshow  player="p1"/ >
					</div>

					<input className={styles.playerInfoInput} maxLength={8} id="playerInfoInput" placeholder="Enter your name"></input>

					<button type="button" className={styles.playerInfobtnOk} onClick={handlePlayer1OkClick}>Ok!</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className={styles.mainContainer} >
				<div className={styles.playerInfoContainer} >
					<p className={styles.playerInfoNumber} >PLAYER 2</p>

					<div className={styles.slideshowContainer} >
						<Slideshow  player="p2"/ >
					</div>

					<input className={styles.playerInfoInput} maxLength={8} id="playerInfoInput" placeholder="Enter your name" ></input>

					<button type="button" className={styles.playerInfobtnOk} onClick={handlePlayer2OkClick} >Ok!</button>
				</div>
			</div>
		);
	}
}

export default SelectPlayer;
