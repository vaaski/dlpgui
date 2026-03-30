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
		},
	},
} satisfies ElectrobunConfig
