import { findFFmpegBinary } from "./yt-dlp-utils/ffmpeg"
import { findYtdlpBinary } from "./yt-dlp-utils/yt-dlp"

export class YtDlpInstance {
	#binary = findYtdlpBinary()
	#binaryFFmpeg = findFFmpegBinary()

	#exec = (cmd: string[]) => {
		if (!this.#binary) {
			throw new Error("Ytdlp binary not found. Please download it first.")
		}

		return Bun.spawn([this.#binary, ...cmd])
	}

	#execFFmpeg = (cmd: string[]) => {
		if (!this.#binaryFFmpeg) {
			throw new Error("FFmpeg binary not found. Please download it first.")
		}

		return Bun.spawn([this.#binaryFFmpeg, ...cmd])
	}

	version = async () => {
		const proc = this.#exec(["--version"])

		const output = await proc.stdout.text()

		return output.trim()
	}

	versionFFmpeg = async () => {
		const proc = this.#execFFmpeg(["-version"])

		const output = await proc.stdout.text()

		return output.trim()
	}
}
