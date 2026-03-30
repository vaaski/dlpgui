import type { RPCSchema } from "electrobun"

export type MyRPC = {
	bun: RPCSchema<{
		requests: {
			getVersion: {
				params: { type: "yt-dlp" | "ffmpeg" }
				response: { output: string }
			}
			downloadYtDlp: {
				params: {}
				response: { path: string }
			}
			ensureBinaries: {
				params: {}
				response: { success: boolean }
			}
		}
		messages: {
			fileChanged: { path: string }
			logSomething: { message: string }
		}
	}>
	webview: RPCSchema<{
		requests: {}
		messages: {}
	}>
}
