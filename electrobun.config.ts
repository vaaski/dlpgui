import type { ElectrobunConfig } from "electrobun"

export default {
	app: {
		name: "dlpgui",
		identifier: "dev.vaaski.dlpgui",
		version: "0.0.1",
	},
	build: {
		bun: {
			entrypoint: "bun/index.ts",
			define: {
				"process.env.DLPGUI_VERSION": JSON.stringify(
					process.env.DLPGUI_VERSION,
				),
			},
		},
		copy: {
			".output/public": "views/mainview",
		},
		watchIgnore: [".output/**"],
		mac: {
			bundleCEF: false,
		},
		linux: {
			bundleCEF: false,
		},
		win: {
			bundleCEF: false,
		},
	},
} satisfies ElectrobunConfig
