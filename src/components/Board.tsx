import generateSquares2 from "../utils/squares.mts";
import styles from "./Board.module.scss";


function Board() {

	console.log("Este", generateSquares2());
	function generateSquares () {
		const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
		const numbers = ["8", "7", "6", "5", "4", "3", "2", "1"];
		const squareList: JSX.Element[] = [];										// This variable will store the final array of squares.

		const tempSquareList = numbers.map( (number) => {							// This variable is temporary because it stores an array of 8 arrays. It will be simplified to a single array in the "squareList" variable
			let isWhite: boolean;

			if (Number(number) % 2 === 0) {											// Even squares start with a white square. The odd ones with a black one.
				isWhite = true;
			} else {
				isWhite = false;
			}

			return letters.map( (letter) => {
				const squareName = letter + number;
				let squareClass: string;

				if (isWhite === true) {
					squareClass = styles.whiteSquare;
				} else {
					squareClass = styles.blackSquare;
				}
				
				isWhite = !isWhite;																// Change the color for the next square.
				return <div key={squareName} id={squareName} className={squareClass}></div>;
			});
		});

		tempSquareList.map( (element) => {						// Simplifies the array of 8 arrays to a single array with all the squares.
			squareList.push(...element);
		});
		
		return squareList;
	}

	console.log(generateSquares());

	return (
		<div className={styles.mainContainer} >
			<div className={styles.blackPiecesContainer} >

			</div>

			<div className={styles.boardContainer} >
				<div className={styles.frameContainer} >
					<div className={styles.sqaresContainer}>
						{generateSquares()}
					</div>
				</div>
			</div>

			<div className={styles.whitePiecesContainer} >

			</div>
		</div>
	);
}

export default Board;
