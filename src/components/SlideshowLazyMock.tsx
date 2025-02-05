import styles from "./SlideshowLazyMock.module.scss";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

function SlideshowLazyMock() {
	return (
		<div className={styles.mainContainer}>
			<div className={styles.imagesContainer}>
				<div className={styles.actualImageContainer}>
					<div className={styles.iconContainer}>
						<HourglassEmptyIcon
							color="inherit"
							fontSize="inherit"
							style={{ display: "block" }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SlideshowLazyMock;
