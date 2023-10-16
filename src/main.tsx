import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PlayersDataProvider } from "./context/PlayersContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<PlayersDataProvider>
			<App />
		</PlayersDataProvider>
	</React.StrictMode>,
);
