type PlayerData = {
	name: string,
	portrait: string,
	changePlayerData: ( newName: string, newPortrait: string ) => void
}

function changePlayerData ( this: PlayerData, newName: string, newPortrait: string ) {
	this.name = newName;
	this.portrait = newPortrait;
}

export const player1Data: PlayerData = {
	name: "",
	portrait: "",
	changePlayerData: changePlayerData
};

export const player2Data: PlayerData = {
	name: "",
	portrait: "",
	changePlayerData: changePlayerData
};