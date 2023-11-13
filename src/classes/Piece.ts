import styles from "../components/Board.module.scss";
import { halfTurnData, isPieceDyingData, piecesData, selectedPieceData } from "../globals/gameData";

abstract class Piece {
	public possibleMoves: string[] = [];
	impossibleMovesForKings: string[] = [];													// It saves possible capture moves (diagonally), which cannot be made now because there are no enemy pieces, but would affect the king if it moves to those possible capture squares.	
	constructor( public id: string, public player: "b" | "w", public image: string, public square: string ) {}

	abstract calcPossibleMoves (): void ;
	testSquareExists = testSquareExists;
	testSquareContainsFriendlyPiece = testSquareContainsFriendlyPiece;
	testSquareContainsEnemyPiece = testSquareContainsEnemyPiece;
	testSquareContainsKing = testSquareContainsKing;
	selectPiece = selectPiece;
	deselectPiece = deselectPiece;
	abstract movePiece (targetSquare: string): void;
	animateMove = animateMove;
	getAnimationCoordinates = getAnimationCoordinates;
	die = die;
	animateDie = animateDie;
	animateTransform = animateTransform;
}

function selectPiece (this: Piece) {
	selectedPieceData.setSelectedPiece(this.id);	
	const possibleTargetSquares = this.possibleMoves; 

	const selectedPieceSquare = document.getElementById(this.square) as HTMLDivElement;
	selectedPieceSquare.classList.add(styles.selectedSquare);

	possibleTargetSquares.map( (element) => {								// Applies classes to possible target squares. The classes are different depending on whether the square is empty or not.
		const square = document.getElementById(element) as HTMLDivElement;
		if (square.hasChildNodes()) {
			square.classList.add(styles.targetSquareWithPiece);
		} else {
			square.classList.add(styles.targetEmptySquare);
		}
	});
}

function deselectPiece (this: Piece) {
	selectedPieceData.setSelectedPiece("");
	const possibleTargetSquares = this.possibleMoves;

	const selectedPieceSquare = document.getElementById(this.square) as HTMLDivElement;
	selectedPieceSquare.classList.remove(styles.selectedSquare);

	possibleTargetSquares.map( (element) => {
		const square = document.getElementById(element) as HTMLDivElement;
		square.classList.remove(styles.targetSquareWithPiece);
		square.classList.remove(styles.targetEmptySquare);
	});
}


function testSquareExists ( this: Piece, newSquare: string ): boolean {				// Checks that the target square is not outside the board.
	const squareLetter = newSquare[0];
	let squareNumberString: string = "";

	for (let i = 1; i < newSquare.length; i++) {										// This part assigns as a value everything other than the letter of the square (the square number can have more than 1 character: a -8)
		squareNumberString = squareNumberString + newSquare[i];
	} 

	const squareNumber = Number(squareNumberString);
	let exists = true;

	if (squareLetter === "x" || squareNumber < 1 || squareNumber > 8) {				
		exists = false;
	}

	return exists;
}

function testSquareContainsFriendlyPiece (this: Piece, newSquare: string ): boolean {			// Checks if the square already contains a piece. If so, check that it is a friendly one.
	let isThereFriendlyPiece = false;

	piecesData.pieces.map( (element) => {											
		if (element.square === newSquare) {
			if (element.player === this.player) {
				isThereFriendlyPiece = true;
			}
		}
	});

	return isThereFriendlyPiece;
}	

function testSquareContainsEnemyPiece (this: Piece, newSquare: string ): boolean {			// Checks if the square already contains a piece. If so, check that it is an enemy.
	let isThereEnemyPiece = false;

	piecesData.pieces.map( (element) => {											
		if (element.square === newSquare) {
			if (element.player !== this.player) {
				isThereEnemyPiece = true;
			}
		}
	});

	return isThereEnemyPiece;
}	

function testSquareContainsKing (this: Piece, newSquare: string ): boolean {				// Check if there is a king (of any type) in the indicated square.
	let isThereKing = false;

	piecesData.pieces.map( (element) => {											
		if (element.square === newSquare) {
			if (element.id === "K" || element.id === "k") {
				isThereKing = true;
			}
		}
	});

	return isThereKing;
}

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

function getAnimationCoordinates ( this: Piece, targetSquare: string): PieceAnimationData2 {
	const targetSquareDiv = document.getElementById(targetSquare) as HTMLDivElement;

	const targetSquareCoordinates = {
		top: window.scrollY + targetSquareDiv.getBoundingClientRect().top,
		left: window.scrollY + targetSquareDiv.getBoundingClientRect().left,
		width: targetSquareDiv.getBoundingClientRect().width,									// The width of the destination square is necessary, because if we do not add it to the "left" property, the piece is positioned at the left edge of the square.
		height:	targetSquareDiv.getBoundingClientRect().height									// The height of the destination square is necessary, because if we do not add it to the "top" property, the piece is positioned at the left edge of the square.
	};

	const pieceToMove = document.getElementById(this.id) as HTMLImageElement;
	
	const pieceToMoveCoordinates = {
		top: window.scrollY + pieceToMove.getBoundingClientRect().top,
		left: window.scrollY + pieceToMove.getBoundingClientRect().left
	};

	const animationsCoordinates: PieceAnimationData2 = {
		piece: pieceToMove,
		pieceCoordinates: pieceToMoveCoordinates,
		targetCoordinates: targetSquareCoordinates
	};

	return animationsCoordinates;
}

function animateMove ( this: Piece, targetSquare: string) {
	const targetSquareElement = document.getElementById(targetSquare) as HTMLDivElement;
	targetSquareElement.classList.remove(styles.checked);

	const animationsCoordinates = this.getAnimationCoordinates(targetSquare);

	let animationAdjust = 8.4;																					// This variable is necessary due to the difference in height between the different types of pieces.

	if (this.id[0] === "Q" || this.id[0] === "q" || this.id[0] === "K" || this.id[0] === "k") {
		animationAdjust = 47.5;
	} else if (this.id[0] === "P" || this.id[0] === "p") {
		animationAdjust = 8.4;
	} else {
		animationAdjust = 20.7;
	}

	const keyframes = [
		{
			position: "absolute",
			top: animationsCoordinates.pieceCoordinates.top + "px",
			left: animationsCoordinates.pieceCoordinates.left + "px",
			width: "5.007vh",
		},
		{
			position: "absolute",
			top: (animationsCoordinates.targetCoordinates.top + (animationsCoordinates.targetCoordinates.height / animationAdjust)) + "px",
			left: animationsCoordinates.targetCoordinates.left + (animationsCoordinates.targetCoordinates.width / 4) + "px",				// The width of the destination square is divided by 4 before adding it so that the piece is right in the center of the square.
			width: "5.007vh",
		}
	];
	
	const options = {
		duration: 500,
		fill: "forwards" as FillMode														// For some reason TypeScript indicates that the types of "fill" (string) do not match those of "FillMode" (the official type for the Web Animations API). Casting the type expressly corrects this error.
	};

	animationsCoordinates.piece.animate(keyframes, options);
}

function die ( this: Piece ) {
	let piecesCopy: Piece[] = [];

	isPieceDyingData.setIsPieceDying(true);

	this.animateDie();
	
	piecesData.pieces.map( (element) => {
		if (element.id !== this.id) {
			piecesCopy = [...piecesCopy, element];
		}
	});

	piecesData.setPieces(piecesCopy);
	halfTurnData.setHalfTurn(0);
}

function animateDie ( this: Piece ) {
	const pieceToAnimate = document.getElementById(this.id) as HTMLImageElement;
	pieceToAnimate.classList.add(styles.dyingPiece);
}


function animateTransform ( this: Piece ) {
	const newPieceElement = document.getElementById(this.id) as HTMLImageElement;		// The piece into which the pawn has been transformed, that is, this object.
	const oldPawnImg = document.createElement("img");									// Create an image of the transformed pawn, which no longer exists, to perform the animation.
	const square = document.getElementById(this.square) as HTMLDivElement;					// The square where we are going to add the old pawn.
	
	let oldPawnImgSrc: string = "";														// We create the necessary attributes for the "oldPawnImg" element

	if (this.player === "w") {
		oldPawnImgSrc = "images/pieces/pawnW.png";
	} else {
		oldPawnImgSrc = "images/pieces/pawnB.png";
	}

	oldPawnImg.alt = "";
	oldPawnImg.src = oldPawnImgSrc;
	oldPawnImg.className = styles.transformNewPiece;
	oldPawnImg.id = "transformAnimationOldPawn";

	square.appendChild(oldPawnImg);														// Add the image of the old pawn and apply the animation to it and the new piece (this object).
	oldPawnImg.classList.add(styles.transformOldPiece);
	newPieceElement.classList.add(styles.transformNewPiece);
}

export default Piece;