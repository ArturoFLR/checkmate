import { PlayerTurnType } from "../../context/GameStateContext";
import { aiLevelData } from "../../globals/gameData";
import { axiosConfig1 } from "../../lib/axios/axios.config";
import { createFEN } from "../../utils/createFEN";


export async function getBestMove (playerTurn: PlayerTurnType) {
	try{
		const response = axiosConfig1.get("", 
			{
				params: 
				{
					fen: createFEN(playerTurn),
					depth: aiLevelData.aiLevel,
					mode: "bestmove"
				}
			}
		);

		console.log((await response).data);
	} catch (error) {
		console.log(error);
	}
}