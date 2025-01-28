import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		baseUrl: "http://localhost:5173/checkmate/",
		viewportWidth: 1051,
		viewportHeight: 700,
	},

	component: {
		devServer: {
			framework: "react",
			bundler: "vite",
		},
	},
});
