import type { MyRPC } from "../shared/types/rpc"

import { platform } from "node:os"

import {
	BrowserWindow,
	Updater,
	Screen,
	BrowserView,
	ApplicationMenu,
	Utils,
} from "electrobun/bun"
import { $fetch } from "ofetch"

import { deleteBinary } from "./binary-utils/yt-dlp"
import { YtDlpInstance } from "./yt-dlp"

const DEV_SERVER_PORT = 3000
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`

const ytdlp = new YtDlpInstance()

const getMainViewUrl = async () => {
	const channel = await Updater.localInfo.channel()
	if (channel === "dev") {
		try {
			await $fetch(DEV_SERVER_URL, {
				method: "HEAD",
				retry: 5,
				retryDelay: 1e3,
			})
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
			getBinaryVersion: async ({ type }) => {
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
			ensureBinaries: async ({ channel }) => {
				await ytdlp.ensureBinaries(channel)
				return { success: true }
			},
			deleteYtDlpBinary: async () => {
				try {
					await deleteBinary()
					return { success: true }
				} catch {
					return { success: false }
				}
			},
			download: async ({ url, outputPath, preset }) => {
				let path = outputPath

				if (outputPath in Utils.paths) {
					path = Utils.paths[outputPath as keyof typeof Utils.paths]
				}

				return {
					filePaths: await ytdlp.download(url, path, preset, (progress) => {
						rpc.send("progress", { params: { progress } })
					}),
				}
			},
			getDlpGuiVersion: async () => {
				return {
					output: process.env.DLPGUI_VERSION ?? "dev",
				}
			},
			checkForDlpGuiUpdate: async () => {
				const updateInfo = await Updater.checkForUpdate()
				if (updateInfo.updateAvailable) {
					await Updater.downloadUpdate()
					await Updater.applyUpdate()
				}
			},
			getPlatform: async () => {
				return {
					output: platform(),
				}
			},
			showFolderPicker: async () => {
				const paths = await Utils.openFileDialog({
					startingFolder: Utils.paths.desktop,
					canChooseFiles: false,
					canChooseDirectory: true,
					allowsMultipleSelection: false,
				})

				return { output: paths.at(0) }
			},
			getClipboard: async () => {
				return { output: Utils.clipboardReadText() }
			},
			showItemInFolder: async ({ path }) => {
				Utils.showItemInFolder(path)
			},
		},
		messages: {
			windowMinimize: () => mainWindow.minimize(),
			windowMaximize: () => {
				if (mainWindow.isMaximized()) {
					mainWindow.unmaximize()
				} else {
					mainWindow.maximize()
				}
			},
			windowClose: () => mainWindow.close(),
		},
	},
})

ApplicationMenu.setApplicationMenu([
	{
		submenu: [{ label: "Quit", role: "quit" }],
	},
	{
		label: "Edit",
		submenu: [
			{ role: "undo" },
			{ role: "redo" },
			{ type: "separator" },
			{ role: "cut" },
			{ role: "copy" },
			{ role: "paste" },
			{ role: "delete" },
			{ role: "selectAll" },
		],
	},
])

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
	titleBarStyle: platform() === "darwin" ? "default" : "hidden",
	styleMask: {
		Resizable: false,
	},
})
