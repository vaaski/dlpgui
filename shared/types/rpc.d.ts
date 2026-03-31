import type { RPCSchema } from "electrobun"
import type { VideoProgress } from "ytdlp-nodejs"

type DownloadChannel = "stable" | "nightly"

export type MyRPC = {
	bun: RPCSchema<{
		requests: {
			getBinaryVersion: {
				params: { type: "yt-dlp" | "ffmpeg" }
				response: { output: string }
			}
			ensureBinaries: {
				params: { channel: DownloadChannel }
				response: { success: boolean }
			}
			deleteYtDlpBinary: {
				params: {}
				response: { success: boolean }
			}
			download: {
				params: {
					url: string
					outputPath:
						| "documents"
						| "desktop"
						| "downloads"
						| "music"
						| "pictures"
						| "videos"
						| ({} & string)

					preset: string[]
				}
				response: { filePaths: string[] }
			}
			getDlpGuiVersion: {
				params: {}
				response: { output: string }
			}
			checkForDlpGuiUpdate: {
				params: {}
				response: {}
			}
			getPlatform: {
				params: {}
				response: { output: string }
			}
			showFolderPicker: {
				params: {}
				response: { output?: string }
			}
			getClipboard: {
				params: {}
				response: { output?: string | null }
			}
			showItemInFolder: {
				params: { path: string }
				response: {}
			}
		}
		messages: {
			windowMinimize: {}
			windowMaximize: {}
			windowClose: {}
		}
	}>
	webview: RPCSchema<{
		requests: {}
		messages: {
			progress: {
				params: { progress: VideoProgress }
			}
		}
	}>
}
