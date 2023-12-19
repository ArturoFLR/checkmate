import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GameStateProvider } from "./context/GameStateContext.tsx";
import { MobileMenuStateProvider } from "./context/MobileMenuStateContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<GameStateProvider>
			<MobileMenuStateProvider>
				<App />
			</MobileMenuStateProvider>
		</GameStateProvider>
	</React.StrictMode>,
);
