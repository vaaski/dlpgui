import type { MyRPC } from "../shared/types/rpc"

import { BrowserWindow, Updater, Screen, BrowserView } from "electrobun/bun"

const DEV_SERVER_PORT = 3000
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`

async function getMainViewUrl(): Promise<string> {
	const channel = await Updater.localInfo.channel()
	if (channel === "dev") {
		try {
			await fetch(DEV_SERVER_URL, { method: "HEAD" })
			console.log(`HMR enabled: Using Nuxt dev server at ${DEV_SERVER_URL}`)
			return DEV_SERVER_URL
		} catch {
			console.log(
				"Nuxt dev server not running. Run 'bun run dev' for HMR support.",
			)
		}
	}
	return "views://mainview/index.html"
}

const rpc = BrowserView.defineRPC<MyRPC>({
	handlers: {
		requests: {
			saveFile: async ({ path, content }) => {
				await Bun.write(path, content)
				return { success: true }
			},
			getYtDlpVersion: async () => {
				return {
					output: "1.0.0",
				}
			},
		},
		messages: {},
	},
})

const url = await getMainViewUrl()

const display = Screen.getPrimaryDisplay()
const windowWidth = 800
const windowHeight = 600

const mainWindow = new BrowserWindow({
	title: "dlpgui",
	url,
	rpc,
	frame: {
		x: display.bounds.x + (display.bounds.width - windowWidth) / 2,
		y: display.bounds.y + (display.bounds.height - windowHeight) / 2,
		width: windowWidth,
		height: windowHeight,
	},
})

rpc.addMessageListener("logSomething", console.log)
