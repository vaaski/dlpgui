import type { RPCSchema } from "electrobun"

export type MyRPC = {
	bun: RPCSchema<{
		requests: {
			saveFile: {
				params: { path: string; content: string }
				response: { success: boolean }
			}
			getYtDlpVersion: {
				params: {}
				response: { output: string }
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
