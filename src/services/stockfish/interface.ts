import { PlayerTurnType } from "../../context/GameStateContext";
import { aiLevelData } from "../../globals/gameData";
import { axiosConfig1 } from "../../lib/axios/axios.config";
import { createFEN } from "../../utils/createFEN";

type responseType = {																			// This is the type of the "data" property of the object that Axios returns.
	success: boolean,
	data: string
}

type AiMoveType = {
    originSquare: string;
    targetSquare: string;
}


export async function getBestMove (playerTurn: PlayerTurnType) {

	try{
		const response = await axiosConfig1.get("", 
			{
				params: 
				{
					fen: createFEN(playerTurn),
					depth: aiLevelData.aiLevel,
					mode: "bestmove"
				}
			}
		);
		const responseData: responseType = response.data;
		const responseMoves = responseData.data;												// Stockfish's response is an object with another property "data", which is where the information we are interested in is.

		const originSquareArray = Array.from(responseMoves).splice(9, 2);
		const originSquareString = originSquareArray.join("");
		const targetSquareArray = Array.from(responseMoves).splice(11, 2);
		const targetSquareString = targetSquareArray.join("");		

		const aiMove: AiMoveType = {
			originSquare: originSquareString,
			targetSquare: targetSquareString,
		};

		console.log(response.data);
		return aiMove;
		
	} catch (error) {
		const aiMove: AiMoveType = {
			originSquare: "",
			targetSquare: "" 
		};

		console.log(error);
		return aiMove;
	}
}