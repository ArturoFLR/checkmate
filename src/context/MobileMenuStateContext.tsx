import { createContext, useContext, useState } from "react";

export type MobileMenuStateType = "init" | "load" | "new";

type MobileMenuStateDataType = {
	mobileMenuState: MobileMenuStateType,
	setMobileMenuState: React.Dispatch<React.SetStateAction<MobileMenuStateType>>
}

const mobileMenuStateData: MobileMenuStateDataType = {
	mobileMenuState: "init",
	setMobileMenuState: () => {}
};

const MobileMenuStateContext = createContext<MobileMenuStateDataType>( mobileMenuStateData );

type MobileMenuStateProviderProps = {
	children: React.ReactNode
}

export function MobileMenuStateProvider ( {children}: MobileMenuStateProviderProps ) {
	const [mobileMenuState, setMobileMenuState] = useState<MobileMenuStateType>("init");
	
	const mobileMenuStateData: MobileMenuStateDataType = {
		mobileMenuState: mobileMenuState,
		setMobileMenuState: setMobileMenuState
	};

	return (
		<MobileMenuStateContext.Provider value={mobileMenuStateData}>
			{children}
		</MobileMenuStateContext.Provider>
	);
}

export function useMobileMenuStateContext () {
	const context = useContext(MobileMenuStateContext);

	if (!context) {
		throw new Error("useThemeContext must be used inside the ThemeProvider");
	}

	return context;
}