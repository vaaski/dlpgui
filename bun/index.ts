import { BrowserWindow, Updater } from "electrobun/bun"

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

const url = await getMainViewUrl()

const mainWindow = new BrowserWindow({
	title: "dlpgui",
	url,
	frame: {
		width: 900,
		height: 700,
		x: 200,
		y: 200,
	},
})

console.log("dlpgui app started!")
