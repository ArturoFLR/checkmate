import { createContext, useContext } from "react";

type PlayersDataProviderProps = {
	children: React.ReactNode
}

type PlayerData = {
	name: string,
	portrait: string,
	changePlayerData: ( newName: string, newPortrait: string ) => void
}

function changePlayerData ( this: PlayerData, newName: string, newPortrait: string ) {
	this.name = newName;
	this.portrait = newPortrait;
}

const player1Data: PlayerData = {
	name: "",
	portrait: "",
	changePlayerData: changePlayerData
};

const player2Data: PlayerData = {
	name: "",
	portrait: "",
	changePlayerData: changePlayerData
};

const PlayersDataContext = createContext([player1Data, player2Data]);

export function PlayersDataProvider( {children}: PlayersDataProviderProps ) {
	return (
		<PlayersDataContext.Provider value={[player1Data, player2Data]}>
			{children}
		</PlayersDataContext.Provider>
	);
}

export const usePlayersDataContext = () => {
	const context = useContext(PlayersDataContext);

	if (!context) {
		throw new Error("useThemeContext must be used inside the ThemeProvider");
	}

	return context;
};
