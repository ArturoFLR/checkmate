import Piece from "../classes/Piece";
import generatePieces from "../utils/generatePieces.mts";

//  AN ARRAY WITH THE PIECES THAT ARE ON THE BOARD AT EVERY MOMENT 

type PiecesDataType = 	{
	pieces: Piece[],
	setPieces: ( newPiecesList: Piece[]) => void
}

const initialPieces = generatePieces();
function setPieces ( this: PiecesDataType, newPiecesList: Piece[] ) {
	this.pieces = newPiecesList;
}

export const piecesData: PiecesDataType = {
	pieces: initialPieces,
	setPieces: setPieces
};

// A STRING THAT INDICATES WHICH PIECE IS CURRENTLY SELECTED (IF ANY)

type SelectedPieceDataType = 	{
	selectedPiece: string,
	setSelectedPiece: ( newSelectedPiece: string) => void
}

function setSelectedPiece (  this: {selectedPiece: string}, newSelectedPiece: string) {
	this.selectedPiece = newSelectedPiece;
}

export const selectedPieceData: SelectedPieceDataType = {
	selectedPiece: "",
	setSelectedPiece: setSelectedPiece
};

// IT CONTAINS THE INFORMATION OF THE SQUARE WHERE AN "EN PASSANT" CAPTURE WOULD BE POSSIBLE AND A COUNTER THAT INDICATES HOW MANY TURNS HAVE PASSED SINCE THIS INFORMATION WAS RECORDED.

type EnPassantTargetDataType = 	{
	enPassantTargetSquare: string,
	enPassantTargetCounter: number,
	setEnPassantTarget: ( newSquare: string, newCounter: number ) => void
}

function setEnPassantTarget ( this: {enPassantTargetSquare: string, enPassantTargetCounter: number}, newSquare: string, newCounter: number ) {
	this.enPassantTargetSquare = newSquare;
	this.enPassantTargetCounter = newCounter;
}

export const enPassantTargetData: EnPassantTargetDataType = {
	enPassantTargetSquare: "",
	enPassantTargetCounter: 0,
	setEnPassantTarget: setEnPassantTarget
};

// IT CONTAINS THE NUMBER OF HALF TURNS THAT HAVE PASSED.

type HalfTurnDataType = {
	halfTurn: number,
	setHalfTurn: ( newHalfTurnNumber: number) => void
}

function setHalfTurn ( this: {halfTurn: number}, newHalfTurnNumber: number) {
	this.halfTurn = newHalfTurnNumber;
}

export const halfTurnData: HalfTurnDataType = {
	halfTurn: 0,
	setHalfTurn: setHalfTurn
};

// IT CONTAINS THE NUMBER OF COMPLETE TURNS THAT HAVE PASSED.

type CompleteTurnDataType = {
	completeTurn: number,
	setCompleteTurn: ( newCompleteTurnNumber: number) => void
}

function setCompleteTurn ( this: {completeTurn: number}, newHalfTurnNumber: number) {
	this.completeTurn = newHalfTurnNumber;
}

export const completeTurnData: CompleteTurnDataType = {
	completeTurn: 0,
	setCompleteTurn: setCompleteTurn
};