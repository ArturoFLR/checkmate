import { PiecesType } from "../classes/PiecesType";
import generatePieces from "../utils/generatePieces.mts";

//  AN ARRAY WITH THE PIECES THAT ARE ON THE BOARD AT EVERY MOMENT 

type PiecesDataType = 	{
	pieces: PiecesType[],
	setPieces: ( newPiecesList: PiecesType[]) => void
}

const initialPieces = generatePieces();
function setPieces ( this: PiecesDataType, newPiecesList: PiecesType[] ) {
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

function setSelectedPiece (  this: SelectedPieceDataType, newSelectedPiece: string) {
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

function setEnPassantTarget ( this: EnPassantTargetDataType, newSquare: string, newCounter: number ) {
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

function setHalfTurn ( this: HalfTurnDataType, newHalfTurnNumber: number) {
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

function setCompleteTurn ( this: CompleteTurnDataType, newHalfTurnNumber: number) {
	this.completeTurn = newHalfTurnNumber;
}

export const completeTurnData: CompleteTurnDataType = {
	completeTurn: 0,
	setCompleteTurn: setCompleteTurn
};

// CONTAINS THE ID OF THE LAST PIECE THAT HAS BEEN MOVED (used in en passant captures).

type LastPawnMovedType = {
	lastPawnMoved: string,
	setLastPawnMoved: ( newLastPieceMoved: string) => void
}

function setLastPawnMoved ( this: LastPawnMovedType, newLastPieceMoved: string) {
	this.lastPawnMoved = newLastPieceMoved;
}

export const lastPawnMovedData: LastPawnMovedType = {
	lastPawnMoved: "",
	setLastPawnMoved: setLastPawnMoved
};

// Indicates whether a piece is executing its death animation. It is used by the "Board" component to know if it should wait longer before changing to the next turn.

type IsPieceDyingType = {
	isPieceDying: boolean,
	setIsPieceDying: ( newValue: boolean) => void
}

function setIsPieceDying ( this: IsPieceDyingType, newValue: boolean) {
	this.isPieceDying = newValue;
}

export const isPieceDyingData: IsPieceDyingType = {
	isPieceDying: false,
	setIsPieceDying: setIsPieceDying
};

// IF A PAWN CAN TRANSFORM AT THE END OF A TURN, ITS ID IS STORED HERE BY "Board". THIS VARIABLE IS USED AND THEN SET TO null BY THE "SelectPiece" COMPONENT.

type PawnToTransformType = {
	pawnToTransform: PiecesType | null,
	setPawnToTransform: ( newPawn: PiecesType | null ) => void
}

function setPawnToTransform ( this: PawnToTransformType, newPawn: PiecesType | null) {
	this.pawnToTransform = newPawn;
}

export const pawnToTransformData: PawnToTransformType = {
	pawnToTransform: null,
	setPawnToTransform: setPawnToTransform
};

// STORES THE DATA OF THE PIECE TO ANIMATE IN A PAWN TRANSFORMATION AT THE BEGINNING OF A TURN, IF ANY. IT IS SET BY THE "pawn.transform()" METHOD AND RESET TO "null" BY "Board" ONCE USED.

type TransformedPieceToAnimateType = {
	transformedPieceToAnimate: PiecesType | null,
	setTransformedPieceToAnimate: ( newPiece: PiecesType | null ) => void
}

function setTransformedPieceToAnimate ( this: TransformedPieceToAnimateType, newPiece: PiecesType | null ) {
	this.transformedPieceToAnimate = newPiece;
}

export const transformedPieceToAnimateData: TransformedPieceToAnimateType = {
	transformedPieceToAnimate: null,
	setTransformedPieceToAnimate: setTransformedPieceToAnimate
};