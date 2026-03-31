import type { RPCSchema } from "electrobun"
import type { VideoProgress } from "ytdlp-nodejs"

type DownloadChannel = "stable" | "nightly"

export type MyRPC = {
	bun: RPCSchema<{
		requests: {
			getVersion: {
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
			getGuiVersion: {
				params: {}
				response: { output: string }
			}
			checkForUpdate: {
				params: {}
				response: {}
			}
			getPlatform: {
				params: {}
				response: { output: string }
			}
			getCustomFolderPath: {
				params: {}
				response: { output?: string }
			}
			getClipboard: {
				params: {}
				response: { output?: string | null }
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
