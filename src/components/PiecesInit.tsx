import { useEffect } from "react";
import Pawn from "../classes/Pawn";
import styles from "./PiecesInit.module.scss";
import { useGameStateContext } from "../context/GameStateContext";
import { PiecesType } from "../classes/PiecesType";
import Rook from "../classes/Rook";
import Knight from "../classes/Knight";
import Bishop from "../classes/Bishop";
import Queen from "../classes/Queen";
import King from "../classes/King";

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
	animate: boolean,
	piecesColor: "black" | "white";
}

function PiecesInit( {animate, piecesColor}: PiecesInitProps ) {
	let piecesAnimationTimeout: number;
	const [, gameStateData] = useGameStateContext();
	const gameState = gameStateData.gameState;
	const setGameState = gameStateData.setGameState;

	function generateInitPieces () {
		let letters: string[];

		if (piecesColor === "black") {
			letters = ["h", "g", "f", "e", "d", "c", "b", "a"];
		} else {
			letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
		}

		let piecesList: PiecesType[] = [];
		let idNumber = 1;
		
		if (piecesColor === "black") {
			// ROOKS
			piecesList = [...piecesList, new Rook(`r${idNumber}`, "b", "images/pieces/rookB.png", "a8")];
			piecesList = [...piecesList, new Rook(`r${idNumber}`, "b", "images/pieces/rookB.png", "h8")];

			// KNIGHTS
			piecesList = [...piecesList, new Knight(`n${idNumber}`, "b", "images/pieces/knightB.png", "b8")];
			piecesList = [...piecesList, new Knight(`n${idNumber}`, "b", "images/pieces/knightB.png", "g8")];

			// BISHOPS
			piecesList = [...piecesList, new Bishop(`o${idNumber}`, "b", "images/pieces/bishopB.png", "c8")];
			piecesList = [...piecesList, new Bishop(`o${idNumber}`, "b", "images/pieces/bishopB.png", "f8")];

			// QUEEN
			piecesList = [...piecesList, new Queen(`q${idNumber}`, "b", "images/pieces/queenB.png", "d8")];

			// KING
			piecesList = [...piecesList, new King(`k${idNumber}`, "b", "images/pieces/kingB.png", "e8")];

			// PAWNS
			letters.map( (letter) => {
				piecesList = [...piecesList, new Pawn(`p${idNumber}`, "b", "images/pieces/pawnB.png", `${letter}7`)];
				idNumber++;
				
			});
		} else {
			// ROOKS
			piecesList = [...piecesList, new Rook(`r${idNumber}`, "w", "images/pieces/rookW.png", "a1")];
			piecesList = [...piecesList, new Rook(`r${idNumber}`, "w", "images/pieces/rookW.png", "h1")];

			// KNIGHTS
			piecesList = [...piecesList, new Knight(`N${idNumber}`, "w", "images/pieces/knightW.png", "b1")];
			piecesList = [...piecesList, new Knight(`N${idNumber}`, "w", "images/pieces/knightW.png", "g1")];

			// BISHOPS
			piecesList = [...piecesList, new Bishop(`B${idNumber}`, "w", "images/pieces/bishopW.png", "c1")];
			piecesList = [...piecesList, new Bishop(`B${idNumber}`, "w", "images/pieces/bishopW.png", "f1")];

			// QUEEN
			piecesList = [...piecesList, new Queen(`Q${idNumber}`, "w", "images/pieces/queenW.png", "d1")];

			// KING
			piecesList = [...piecesList, new King(`K${idNumber}`, "w", "images/pieces/kingW.png", "e1")];

			// PAWNS
			letters.map( (letter) => {
				piecesList = [...piecesList, new Pawn(`P${idNumber}`, "w", "images/pieces/pawnW.png", `${letter}2`)];
				idNumber++;
				
			});
		}

		return piecesList;
	}

	function generateInitSquares () {
		const pieces = 	generateInitPieces ();
		
		return pieces.map( (element) => {
			let pieceClass: string = "";

			if (element.id[0] === "P" || element.id[0] === "p") {
				pieceClass = styles.pawnPiece;
			} else if (element.id[0] === "K" || element.id[0] === "k" || element.id[0] === "Q" || element.id[0] === "q") {
				pieceClass = styles.kingAndQueenPieces;
			} else {
				pieceClass = styles.rookBishopKnightPieces;
			}

			return (
				<div key={`target ${element.square}`} className={styles.pieceContainer}>
					<img alt="Piece" src={element.image} id={`target ${element.square}`} className={pieceClass}></img>
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


	function checkPieceTypeBySquare ( square: string ) {											// Used to return the type of the piece based on the square it is in, to apply the correct value to its animation adjust value in the "animatePieces" function.
		const squareLetter = square[7];
		const squareNumber = Number(square[8]);

		if (squareNumber === 2) {
			return "P";
		} else if (squareNumber === 7) {
			return "p";
		} else if (squareNumber === 1 && (squareLetter === "d" || squareLetter === "e")) {
			return "KQ";
		} else if (squareNumber === 8 && (squareLetter === "d" || squareLetter === "e")) {
			return "kq";
		} else if (squareNumber === 1 && (squareLetter === "a" || squareLetter === "b" || squareLetter === "c" || squareLetter === "f" || squareLetter === "g" || squareLetter === "h")) {
			return "RKB";
		} else if (squareNumber === 8 && (squareLetter === "a" || squareLetter === "b" || squareLetter === "c" || squareLetter === "f" || squareLetter === "g" || squareLetter === "h")) {
			return "rkb";
		} 
	}


	function animatePieces () {
		const animationData = getAnimationsCoordinates();
		let timer = 0;
		const screenWidth = window.innerWidth;									// Used to adjust the animation to different resolutions.
		let animationAdjust = 0;


		animationData.map( (element) => {

			if (screenWidth >= 1900 && screenWidth < 1920) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = 0.5;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = 0;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = 0.5;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = 0.8;
				}
			}

			if (screenWidth >= 1920 && screenWidth < 2500) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = 3.5;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = 0.8;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = 1.5;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = 3;
				}
			}

			if (screenWidth >= 2500 && screenWidth < 3800) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = 8.5;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = 2.2;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = 3.95;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = 8.3;
				}
			}

			if (screenWidth >= 3800) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = 18;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = 5;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = 8.79;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = 18;
				}
			}

			if (screenWidth < 1500 && screenWidth >= 1300) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = 0.5;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = 0;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = 0.5;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = 0.8;
				}
			}

			if (screenWidth < 1300 && screenWidth >= 1200) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = -0.6;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = 0;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = -0.2;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = -0.6;
				}
			}

			if (screenWidth < 1200 && screenWidth >= 1050) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = 0.6;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = 0;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = 0.48;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = 0.6;
				}
			}

			if (screenWidth < 1050 && screenWidth >= 950) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = -1.6;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = -0.5;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = -0.48;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = -1.6;
				}
			}

			if (screenWidth < 950 && screenWidth >= 800) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = -1;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = -0.3;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = -0.3;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = -1;
				}
			}

			if (screenWidth < 800) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = -0.3;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = 0;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = 0;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = -0.2;
				}
			}

			if (screenWidth < 450) {

				if (checkPieceTypeBySquare(element.piece.id) === "P") {
					animationAdjust = -0.3;
				} else if (checkPieceTypeBySquare(element.piece.id) === "KQ" || checkPieceTypeBySquare(element.piece.id) === "kq") {
					animationAdjust = 0;
				}  else if (checkPieceTypeBySquare(element.piece.id) === "RKB" || checkPieceTypeBySquare(element.piece.id) === "rkb") {
					animationAdjust = 0;
				} else if (checkPieceTypeBySquare(element.piece.id) === "p") {
					animationAdjust = -0.2;
				}
			}

			const keyframes = [
				{
					position: "absolute",
					top: element.pieceCoordinates.top + "px",
					left: element.pieceCoordinates.left + "px",
					offset: 0
				},
				{
					position: "absolute",
					top: (element.targetCoordinates.top + animationAdjust) + "px",
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