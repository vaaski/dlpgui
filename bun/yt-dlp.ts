import type { DownloadChannel } from "../shared/types/rpc"

import { YtDlp, type VideoProgress } from "ytdlp-nodejs"

import { downloadFFmpeg, findFFmpegBinary } from "./binary-utils/ffmpeg"
import { downloadYtDlp, findYtdlpBinary } from "./binary-utils/yt-dlp"

export class YtDlpInstance {
	#binary: string | undefined
	#binaryFFmpeg: string | undefined

	ytDlp = new YtDlp({
		binaryPath: findYtdlpBinary(),
		ffmpegPath: findFFmpegBinary(),
	})

	#exec = (
		cmd: string[],
		options?: Bun.SpawnOptions.SpawnOptions<"ignore", "pipe", "inherit">,
	) => {
		if (!this.#binary) {
			this.#binary = findYtdlpBinary()

			if (!this.#binary) {
				throw new Error("yt-dlp binary not found. Please download it first.")
			}
		}

		return Bun.spawn([this.#binary, ...cmd], options)
	}

	#execFFmpeg = (cmd: string[]) => {
		if (!this.#binaryFFmpeg) {
			this.#binaryFFmpeg = findFFmpegBinary()

			if (!this.#binaryFFmpeg) {
				throw new Error("FFmpeg binary not found. Please download it first.")
			}
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

	ensureBinaries = async (channel: DownloadChannel) => {
		const ytdlp = await downloadYtDlp(channel)
		if (!ytdlp) throw new Error("Ytdlp binary couldn't be downloaded.")

		const ffmpeg = await downloadFFmpeg()
		if (!ffmpeg) throw new Error("FFmpeg binary couldn't be downloaded.")

		this.ytDlp.binaryPath = ytdlp
		this.ytDlp.ffmpegPath = ffmpeg

		this.#binary = ytdlp
		this.#binaryFFmpeg = ffmpeg
	}

	download = async (
		url: string,
		outputPath: string,
		preset: string[],
		onProgress: (progress: VideoProgress) => void,
	) => {
		const result = await this.ytDlp
			.download(url)
			.addArgs(...preset)
			.output(outputPath)
			.on("progress", onProgress)

		return result.filePaths
	}
}
