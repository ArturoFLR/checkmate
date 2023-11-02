import { useEffect } from "react";
import { useGameStateContext } from "../context/GameStateContext";
import { pawnToTransformData } from "../globals/gameData";
import styles from "./SelectPiece.module.scss";

type SelectPieceProps = {
	preEndturnCheks (): void
}

function SelectPiece ( {preEndturnCheks}: SelectPieceProps ) {
	const [playerTurnData] = useGameStateContext();
	const {playerTurn} = playerTurnData;
	let pieceSelectedId: string = "";
	let transformAnimationTimeout: number;

	function handlePieceClick ( event: React.MouseEvent<HTMLImageElement> ) {								
		const pieceImageElement = event.target as HTMLImageElement;
		const pieceContainerElement =  pieceImageElement.parentElement as HTMLDivElement;
		const pieceContainerSelected = document.querySelector(`.${styles.pieceSelected}`);
		
		pieceSelectedId = pieceImageElement.id;

		pieceContainerSelected?.classList.remove(styles.pieceSelected);

		pieceContainerElement.classList.add(styles.pieceSelected);
	}

	function handleOkClick () {
		const containers = document.getElementById("piecesGalleryContainer") as HTMLDivElement;

		if (pieceSelectedId) {
			containers.classList.remove(styles.highlightGallery);												// Eliminates the styles applied by the handlePieceClick function, and also those applied when we try to confirm without having selected a piece (highlightGallery)
			const pieceContainerSelected = document.querySelector(`.${styles.pieceSelected}`);
			pieceContainerSelected?.classList.remove(styles.pieceSelected);

			pawnToTransformData.pawnToTransform?.transform(pieceSelectedId);									// Execute the "transform" method of the pawn to be transformed.

			pawnToTransformData.setPawnToTransform(null);														// Resets the variable to "null" once used.

			pieceSelectedId = "";																				// Reset the variable so that there is no piece selected by default the next time this component appears.
		} else {
			containers.classList.remove(styles.highlightGallery);												// Remove the styles to make the animation repeatable.
			setTimeout( () => {
				containers.classList.add(styles.highlightGallery);
			},0);
		}

		preEndturnCheks();
	}

	useEffect( () => {
		return () => {
			clearTimeout(transformAnimationTimeout);
		};
	});

	return (
		<div className={styles.mainContainer}>
			<div className={styles.dataContainer}>
				<h2>Choose a piece</h2>

				<div className={styles.piecesGalleryContainer} id="piecesGalleryContainer">
					{
						playerTurn === "w"
							? (
								<>
									<div className={styles.pieceContainer} id="Q" > 
										<img alt="Queen" src="images/pieces/queenW.png" id="Q" onClick={handlePieceClick} />
									</div>
									<div className={styles.pieceContainer} id="R" > 
										<img alt="Rook" src="images/pieces/rookW.png" id="R" onClick={handlePieceClick} />
									</div>
									<div className={styles.pieceContainer} id="B" > 
										<img alt="Bishop" src="images/pieces/bishopW.png" id="B" onClick={handlePieceClick} />
									</div>
									<div className={styles.pieceContainer} id="K" > 
										<img alt="Knight" src="images/pieces/knightW.png" id="K" onClick={handlePieceClick} />
									</div>
								</>
							)
							: (
								<>
									<div className={styles.pieceContainer} id="q" > 
										<img alt="Queen" src="images/pieces/queenB.png" id="q" onClick={handlePieceClick} />
									</div>
									<div className={styles.pieceContainer} id="r" > 
										<img alt="Rook" src="images/pieces/rookB.png" id="r" onClick={handlePieceClick} />
									</div>
									<div className={styles.pieceContainer} id="b" > 
										<img alt="Bishop" src="images/pieces/bishopB.png" id="b" onClick={handlePieceClick} />
									</div>
									<div className={styles.pieceContainer} id="k" > 
										<img alt="Knight" src="images/pieces/knightB.png" id="k" onClick={handlePieceClick} />
									</div>
								</>
							)
					}
				</div>

				<button className={styles.btnConfirm} onClick={handleOkClick} >Ok!</button>

			</div>
		</div>
	);
}

export default SelectPiece;
