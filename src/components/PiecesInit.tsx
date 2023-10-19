import { useEffect } from "react";
import Pawn from "../classes/Pawn";
import styles from "./PiecesInit.module.scss";
import { GameState } from "../App";

type PieceAnimationData = {
	piece: HTMLImageElement,
	pieceCoordinates: {
		top: number,
		left: number
	}
	targetCoordinates: {
		top: number,
		left: number,
		width: number
	}
}

type PiecesInitProps = {
	setGameState: React.Dispatch<React.SetStateAction<GameState>>,
	animate: boolean,
	gameState: GameState,
	piecesColor: "black" | "white";
}

function PiecesInit( {setGameState, animate, gameState, piecesColor}: PiecesInitProps ) {
	let piecesAnimationTimeout: number;

	function generateInitPieces () {
		let letters: string[];

		if (piecesColor === "black") {
			letters = ["h", "g", "f", "e", "d", "c", "b", "a"];
		} else {
			letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
		}

		let piecesList: Pawn[] = [];
		let idNumber = 1;
		
		if (piecesColor === "black") {
			letters.map( (letter) => {
				for (let i:number = 7; i <= 8; i++) {
					piecesList = [...piecesList, new Pawn(`p${idNumber}`, "images/pieces/pawnB.png", `${letter}${i}`)];
					idNumber++;
				}
			});
		} else {
			letters.map( (letter) => {
				for (let i:number = 1; i <= 2; i++) {
					piecesList = [...piecesList, new Pawn(`P${idNumber}`, "images/pieces/pawnW.png", `${letter}${i}`)];
					idNumber++;
				}
			});
		}

		return piecesList;
	}

	function generateInitSquares () {
		const pieces = 	generateInitPieces ();
		
		return pieces.map( (element) => {
			return (
				<div key={`target ${element.square}`} className={styles.pieceContainer}>
					<img alt="Piece" src={element.image} id={`target ${element.square}`} ></img>
				</div>
			);
		});
	}

	function getAnimationsCoordinates () {
		const pieces = 	generateInitPieces();
		let animationsCoordinates: PieceAnimationData[] = [];

		pieces.map( (element) => {
			const targetSquare = document.getElementById(element.square) as HTMLDivElement;
			const targetSquareCoordinates = {
				top: window.scrollY + targetSquare.getBoundingClientRect().top,
				left: window.scrollY + targetSquare.getBoundingClientRect().left,
				width: targetSquare.getBoundingClientRect().width										// The width of the destination square is necessary, because if we do not add it to the "left" property, the piece is positioned at the left edge of the square.
			};

			const pieceToMove = document.getElementById(`target ${element.square}`) as HTMLImageElement;
			const pieceToMoveCoordinates = {
				top: window.scrollY + pieceToMove.getBoundingClientRect().top,
				left: window.scrollY + pieceToMove.getBoundingClientRect().left
			};

			const thisPieceAnimationData = {
				piece: pieceToMove,
				pieceCoordinates: pieceToMoveCoordinates,
				targetCoordinates: targetSquareCoordinates
			};
			
			animationsCoordinates = [...animationsCoordinates, thisPieceAnimationData];
		});

		return animationsCoordinates;
	}

	function animatePieces () {
		const animationData = getAnimationsCoordinates();
		let timer = 0;

		animationData.map( (element) => {
			const keyframes = [
				{
					position: "absolute",
					top: element.pieceCoordinates.top + "px",
					left: element.pieceCoordinates.left + "px",
					offset: 0
				},
				{
					position: "absolute",
					top: element.targetCoordinates.top + "px",
					left: element.targetCoordinates.left + (element.targetCoordinates.width / 4) + "px",				// The width of the destination square is divided by 4 before adding it so that the piece is right in the center of the square.
					offset: 1
				}
			];
			
			const options = {
				duration: 500,
				fill: "forwards" as FillMode														// For some reason TypeScript indicates that the types of "fill" (string) do not match those of "FillMode" (the official type for the Web Animations API). Casting the type expressly corrects this error.
			};
			
			setTimeout( () => {
				element.piece.animate(keyframes, options);
			}, timer);

			timer = timer + 150;
		});

		piecesAnimationTimeout = setTimeout( () => {
			if (gameState === "gameIntro1P") {
				setGameState("gameStarted1P");
			} else {
				setGameState("gameStarted2P");
			}
		}, 2800);

	}

	useEffect( () => {
		if ( animate === true ) {
			animatePieces();
		}

		return () => {
			clearTimeout(piecesAnimationTimeout);
		};
	});

	return (
		<div className={styles.mainContainer}>
			{generateInitSquares()}
		</div>
	);
}

export default PiecesInit;