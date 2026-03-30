import type { MyRPC } from "../shared/types/rpc"

import { BrowserWindow, Updater, Screen, BrowserView } from "electrobun/bun"

import { YtDlpInstance } from "./yt-dlp"

const DEV_SERVER_PORT = 3000
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`

const ytdlp = new YtDlpInstance()

const getMainViewUrl = async () => {
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
	maxRequestTime: 60e3,
	handlers: {
		requests: {
			getVersion: async ({ type }) => {
				switch (type) {
					case "yt-dlp": {
						return {
							output: await ytdlp.version(),
						}
					}
					case "ffmpeg": {
						const versionFull = await ytdlp.versionFFmpeg()
						return {
							output: versionFull.split("Copyright").at(0) ?? versionFull,
						}
					}
				}
			},
			ensureBinaries: async () => {
				await ytdlp.ensureBinaries()
				return { success: true }
			},
			download: async ({ url, outputPath, preset }) => {
				return {
					filePaths: await ytdlp.download(url, outputPath, preset),
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

// const mainWindow =
new BrowserWindow({
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
