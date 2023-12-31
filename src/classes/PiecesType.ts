type PieceAnimationData2 = {
	piece: HTMLImageElement,
	pieceCoordinates: {
		top: number,
		left: number
	}
	targetCoordinates: {
		top: number,
		left: number,
		width: number,
		height: number
	}
}

export type PiecesType = {
	id: string;
	player: "b" | "w";
	image: string;
	square: string;
	possibleMoves: string[];
	impossibleMovesForKings: string[];
	isFirstMove?: boolean;
	possibleMovesForKings?: string[];
	isCheck?: boolean;
	isShortCastlingPossible?: boolean;
	isLongCastlingPossible?: boolean;
	invalidSquaresDueToCheck?: string[];


	calcPossibleMoves (): void ;
	movePiece (targetSquare: string): void;
	selectPiece(): void;
	deselectPiece(): void;
	testSquareExists(newSquare: string): boolean
	testSquareContainsFriendlyPiece(newSquare: string): boolean
	testSquareContainsEnemyPiece(newSquare: string): boolean
	testSquareContainsKing(newSquare: string): boolean
	getAnimationCoordinates(targetSquare: string): PieceAnimationData2;
	animateMove(targetSquare: string): void;
	die(): void;
	animateDie(): void;
	animateTransform(): void
	transform? (newPiece: string): void;
	testKingCheck? (): void;
	animateKingDying? (): void;
	testKingCheckNoStyles? (): void;
}