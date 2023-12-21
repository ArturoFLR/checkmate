import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./public"),
		},
	},
	plugins: [
		react(),
		VitePWA({
			devOptions: {
				enabled: true
			},
			manifest: {
				"name":"Checkmate!",
				"short_name":"Checkmate!",
				"start_url":"/checkmate",
				"display":"standalone",
				"background_color":"#000000",
				"theme_color":"#ffffff",
				"lang":"es",
				"scope":"/",
				"icons":[
					{
						"src": "icons/pwa/manifest-icon-192.maskable.png",
						"sizes": "192x192",
						"type": "image/png",
						"purpose": "any"
					},
					{
						"src": "icons/pwa/manifest-icon-192.maskable.png",
						"sizes": "192x192",
						"type": "image/png",
						"purpose": "maskable"
					},
					{
						"src": "icons/pwa/manifest-icon-512.maskable.png",
						"sizes": "512x512",
						"type": "image/png",
						"purpose": "any"
					},
					{
						"src": "icons/pwa/manifest-icon-512.maskable.png",
						"sizes": "512x512",
						"type": "image/png",
						"purpose": "maskable"
					}
				]
			},
			injectRegister: "inline",
			strategies: "injectManifest",
			registerType: "autoUpdate",
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg}"],
				globIgnores: ["**/node_modules/**/*", "package.json", "package-lock.json"]
			},
			srcDir: ".",
			filename: "sw.js"
		})
	],
	base: "/checkmate/",
});
