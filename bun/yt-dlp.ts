import { YtDlp } from "ytdlp-nodejs"

import { downloadFFmpeg, findFFmpegBinary } from "./yt-dlp-utils/ffmpeg"
import { downloadYtDlp, findYtdlpBinary } from "./yt-dlp-utils/yt-dlp"

export class YtDlpInstance {
	#binary = findYtdlpBinary()
	#binaryFFmpeg = findFFmpegBinary()

	ytDlp = new YtDlp()

	#exec = (
		cmd: string[],
		options?: Bun.SpawnOptions.SpawnOptions<"ignore", "pipe", "inherit">,
	) => {
		if (!this.#binary) {
			throw new Error("Ytdlp binary not found. Please download it first.")
		}

		return Bun.spawn([this.#binary, ...cmd], options)
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

	ensureBinaries = async () => {
		const ytdlp = await downloadYtDlp()
		if (!ytdlp) throw new Error("Ytdlp binary couldn't be downloaded.")

		const ffmpeg = await downloadFFmpeg()
		if (!ffmpeg) throw new Error("FFmpeg binary couldn't be downloaded.")

		this.ytDlp.binaryPath = ytdlp
		this.ytDlp.ffmpegPath = ffmpeg

		this.#binary = ytdlp
		this.#binaryFFmpeg = ffmpeg
	}

	download = async (url: string, outputPath: string, preset: string[]) => {
		const result = await this.ytDlp
			.download(url)
			.addArgs(...preset)
			.output(outputPath)

		return result.filePaths
	}
}
