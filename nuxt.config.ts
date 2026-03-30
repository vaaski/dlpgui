// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/ui"],
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
})
