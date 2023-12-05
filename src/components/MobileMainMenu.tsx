import { useEffect } from "react";
import MainMenu from "./MainMenu";
import styles from "./MobileMainMenu.module.scss";

function MobileMainMenu() {
	let menuClosesTimer: number;

	function changeMobileMenuVisibility () {
		const menuContainer = document.getElementById("menuContainer2") as HTMLDivElement;

		if (menuContainer.classList.contains(styles.hidden)) {
			menuContainer.classList.remove(styles.hidden);
		} else {
			const contentContainer = document.getElementById("contentContainer2") as HTMLDivElement;
			contentContainer.classList.add(styles.menuCloses);

			menuClosesTimer = setTimeout(() => {
				menuContainer.classList.add(styles.hidden);
				contentContainer.classList.remove(styles.menuCloses);
			}, 800);
		}
	}

	useEffect( () => {
		return () => {
			clearTimeout(menuClosesTimer);
		};
	});

	return (
		<div className={styles.mainContainer}>
			<button type="button" className={styles.btnOpenMenu} onClick={changeMobileMenuVisibility}>
				<img alt="Menu button" src="icons/icon-menu.svg"></img>
			</button>

			<div className={`${styles.menuContainer} ${styles.hidden}`} id="menuContainer2">
				<div className={styles.menuContentContainer} id="contentContainer2">

					<button type="button" className={styles.btnCloseMenu} onClick={changeMobileMenuVisibility}>
						<img alt="Close Menu button" src="icons/icon-close.svg"></img>
					</button>

					<MainMenu />	

				</div>
			</div>
		</div>
	);
}

export default MobileMainMenu;
