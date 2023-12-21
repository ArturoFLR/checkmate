import {
	googleFontsCache,
} from "workbox-recipes";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

self.skipWaiting();
clientsClaim();


cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

googleFontsCache();



