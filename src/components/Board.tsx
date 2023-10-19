import { useEffect } from "react";
import generateSquares from "../utils/generateSquares";
import styles from "./Board.module.scss";

type BoardProps = {
	showPieces: boolean
}

function Board( {showPieces}: BoardProps) {


	useEffect( () => {

		const pieces = document.querySelectorAll(`.${styles.mainContainer} img`);
		const piecesArray = Array.from(pieces);
		
		if ( showPieces === false) {
			piecesArray.map( (element) => {
				element.classList.add(styles.hide);
			});
		} else {
			piecesArray.map( (element) => {
				element.classList.remove(styles.hide);
			});
		}

	});

	return (
		<div className={styles.mainContainer} >
			<div className={styles.boardContainer} >
				<div className={styles.frameContainer} >
					<div className={styles.sqaresContainer}>
						{generateSquares()}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Board;
