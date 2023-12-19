import { useGameStateContext } from "../context/GameStateContext";
import { useMobileMenuStateContext } from "../context/MobileMenuStateContext";
import styles from "./MainMenuMobile.module.scss";
import MobilePrimaryMenu from "./MobilePrimaryMenu";
import MobileSecondaryMenu from "./MobileSecondaryMenu";

function MainMenuMobile() {

	const [, gameStateData] = useGameStateContext();
	const {setMobileMenuState} = useMobileMenuStateContext();
	const gameState = gameStateData.gameState; 

	function openMobileMenu () {
		const mobileMainMenu = document.getElementById("mobileMainMenuContainer") as HTMLDivElement;

		mobileMainMenu.classList.remove(styles.hide);
	}

	function closeMobileMenu () {
		const mobileMainMenu = document.getElementById("mobileMainMenuContainer") as HTMLDivElement;

		mobileMainMenu.classList.add(styles.hide);

		setMobileMenuState("init");																					// Resets the state of the MobilePrimaryMenu component so that no suboptions are left open
	}

	return (
		<>
			<img alt="Menu Button" src="icons/icon-menu.svg" className={styles.btnMobileMenu} onClick={openMobileMenu}/>

			<div className={`${styles.mobileMainMenuContainer} ${styles.hide}`} id="mobileMainMenuContainer">
				<div className={styles.mobileMainMenuContent} id="mobileMainMenuContent">

					<img alt="Close Menu" src="icons/icon-close.svg" className={styles.btnCloseMobileMenu} onClick={closeMobileMenu} ></img>

					{
						gameState !== "preGame" && gameState !== "select1Player" && gameState !== "select2Players"
							? <MobileSecondaryMenu /> 
							: <MobilePrimaryMenu />
					}

				</div>
			</div>
		</>
	);
}

export default MainMenuMobile;
