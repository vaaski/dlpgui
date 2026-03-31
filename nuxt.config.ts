// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/ui", "@nuxtjs/i18n"],
	css: ["~/assets/css/main.css"],

	ssr: false,
	experimental: {
		// Inline payload in HTML, extract for client-side navigation only
		payloadExtraction: "client",
	},

	typescript: {
		tsConfig: {
			exclude: ["../bun/**/*"],
		},
	},

	i18n: {
		defaultLocale: "en",
		strategy: "no_prefix",
		locales: [
			{ code: "en", name: "English", file: "en.json" },
			{ code: "de", name: "Deutsch", file: "de.json" },
		],
	},

	router: {
		options: {
			hashMode: true,
		},
	},
})
