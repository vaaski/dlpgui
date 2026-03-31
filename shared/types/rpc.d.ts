import type { RPCSchema } from "electrobun"
import type { VideoProgress } from "ytdlp-nodejs"

export type MyRPC = {
	bun: RPCSchema<{
		requests: {
			getVersion: {
				params: { type: "yt-dlp" | "ffmpeg" }
				response: { output: string }
			}
			ensureBinaries: {
				params: {}
				response: { success: boolean }
			}
			download: {
				params: { url: string; outputPath: string; preset: string[] }
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
