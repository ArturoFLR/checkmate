import { createContext, useContext, useState } from "react";

export type GameStateType = "preGame" | "select1Player" | "select2Players" | "gameIntro1P" | "gameIntro2P" | "gameStarted1P" | "gameStarted2P" | "gameLoading" | "gameWinP1" | "gameWinP2" | "gameDrawStalemate" | "gameDrawDeadPosition" | "gameDraw50Moves";
export type PlayerTurnType = "w" | "b";

type PlayerTurnDataType = {
	playerTurn: PlayerTurnType,
	setPlayerTurn: React.Dispatch<React.SetStateAction<PlayerTurnType>>
}

type GameStateDataType = {
	gameState: GameStateType,
	setGameState: React.Dispatch<React.SetStateAction<GameStateType>>
}

type GameStateContextType = [
	playerTurnData: PlayerTurnDataType,
	gameStateData: GameStateDataType
]

const playerTurnData: PlayerTurnDataType = {
	playerTurn: "w",
	setPlayerTurn: () => {}
};

const gameStateData: GameStateDataType = {
	gameState: "preGame",
	setGameState: () => {}
};

const GameStateContext = createContext<GameStateContextType>( [playerTurnData, gameStateData]);

type GameStateProviderProps = {
	children: React.ReactNode
}

export function GameStateProvider ( {children}: GameStateProviderProps ) {
	const [gameState, setGameState] = useState<GameStateType>("preGame");
	const [playerTurn, setPlayerTurn] = useState<PlayerTurnType>("w");

	const playerTurnData: PlayerTurnDataType = {
		playerTurn: playerTurn,
		setPlayerTurn: setPlayerTurn
	};
	
	const gameStateData: GameStateDataType = {
		gameState: gameState,
		setGameState: setGameState
	};

	return (
		<GameStateContext.Provider value={[playerTurnData, gameStateData]}>
			{children}
		</GameStateContext.Provider>
	);
}

export function useGameStateContext () {
	const context = useContext(GameStateContext);

	if (!context) {
		throw new Error("useThemeContext must be used inside the ThemeProvider");
	}

	return context;
}