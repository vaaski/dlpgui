import type { DownloadChannel } from "../../shared/types/rpc"

import crypto from "crypto"
import * as fs from "fs"
import { unlink } from "fs/promises"
import * as path from "path"

import { BIN_DIR } from "./paths"
import { downloadFile, fetchText } from "./request"

const downloadBase = (channel: DownloadChannel) =>
	channel === "stable"
		? "https://github.com/yt-dlp/yt-dlp/releases/latest/download"
		: "https://github.com/yt-dlp/yt-dlp-nightly-builds/releases/latest/download"

const useZip = () => process.platform === "darwin" && process.arch === "arm64"

const PLATFORM_MAPPINGS: Record<string, Record<string, string>> = {
	win32: {
		x64: "yt-dlp.exe",
		ia32: "yt-dlp_x86.exe",
	},
	linux: {
		x64: "yt-dlp",
		armv7l: "yt-dlp_linux_armv7l",
		aarch64: "yt-dlp_linux_aarch64",
		arm64: "yt-dlp",
	},
	darwin: {
		x64: "yt-dlp_macos",
		arm64: "yt-dlp_macos",
	},
	android: {
		arm64: "yt-dlp",
	},
}

const getYtdlpFilename = () => {
	const platform = process.platform as string
	const arch = process.arch as string

	if (!PLATFORM_MAPPINGS[platform] || !PLATFORM_MAPPINGS[platform][arch]) {
		throw new Error(`No yt-dlp build available for ${platform} ${arch}`)
	}

	const filename = PLATFORM_MAPPINGS[platform][arch]

	return filename
}

export const deleteBinary = async () => {
	const fileName = path.join(BIN_DIR, getYtdlpFilename())
	await unlink(fileName)

	if (useZip()) {
		const internalsPath = path.join(BIN_DIR, "_internal")
		await unlink(internalsPath)
	}
}

const downloadYtdlpZip = async (channel: DownloadChannel) => {
	const fileName = getYtdlpFilename()
	const fileNameZip = fileName + ".zip"

	const downloadUrl: string = `${downloadBase(channel)}/${fileNameZip}`
	const outputPath = path.join(BIN_DIR, fileName)
	const outputPathZip = path.join(BIN_DIR, fileNameZip)
	const outputPathInternals = path.join(BIN_DIR, "_internal")

	const preexisting =
		fs.existsSync(outputPath) && fs.existsSync(outputPathInternals)
	if (preexisting) return outputPath

	console.log(`Downloading yt-dlp...`, downloadUrl)

	if (!fs.existsSync(BIN_DIR)) {
		fs.mkdirSync(BIN_DIR, { recursive: true })
	}

	try {
		await downloadFile(downloadUrl, outputPathZip)

		await Bun.$`unzip -o ${outputPathZip} -d ${BIN_DIR}`
		fs.unlinkSync(outputPathZip)

		console.log(`yt-dlp downloaded successfully to: ${outputPath}`)
		// Set executable permissions (Unix-like systems only)
		if (process.platform !== "win32") {
			fs.chmodSync(outputPathInternals, 0o755)
			fs.chmodSync(outputPath, 0o755)
		}

		return outputPath
	} catch (error) {
		console.error(`Download failed: ${error}`)
		throw error
	}
}

export const downloadYtDlp = async (channel: DownloadChannel) => {
	const fileName = getYtdlpFilename()

	// for apple silicon, download the zip file instead of the binary
	// https://github.com/yt-dlp/yt-dlp/issues/10425
	if (useZip()) {
		return downloadYtdlpZip(channel)
	}

	const downloadUrl: string = `${downloadBase(channel)}/${fileName}`

	const outputPath = path.join(BIN_DIR, fileName)

	const preexisting = fs.existsSync(outputPath)
	if (preexisting) return outputPath

	console.log(`Downloading yt-dlp...`, downloadUrl)

	if (!fs.existsSync(BIN_DIR)) {
		fs.mkdirSync(BIN_DIR, { recursive: true })
	}

	try {
		await downloadFile(downloadUrl, outputPath)
		console.log(`yt-dlp downloaded successfully to: ${outputPath}`)
		// Set executable permissions (Unix-like systems only)
		if (process.platform !== "win32") {
			fs.chmodSync(outputPath, 0o755)
		}

		return outputPath
	} catch (error) {
		console.error(`Download failed: ${error}`)
		throw error
	}
}

const sha256File = async (filePath: string) => {
	return new Promise<string>((resolve, reject) => {
		const hash = crypto.createHash("sha256")
		const stream = fs.createReadStream(filePath)
		stream.on("data", (data) => hash.update(data))
		stream.on("end", () => resolve(hash.digest("hex")))
		stream.on("error", reject)
	})
}

const getChecksum = async (channel: DownloadChannel, fileName: string) => {
	try {
		const checksums = await fetchText(`${downloadBase(channel)}/SHA2-256SUMS`)
		const lines = checksums.split(/\r?\n/)
		const match = lines.find((line) => line.includes(fileName))
		if (!match) return undefined
		const [hash] = match.trim().split(/\s+/)
		return hash || undefined
	} catch {
		return undefined
	}
}

export const downloadYtDlpVerified = async (channel: DownloadChannel) => {
	const outputPath = await downloadYtDlp(channel)
	const fileName = path.basename(outputPath)
	const checksum = await getChecksum(channel, fileName)
	if (!checksum) {
		return { path: outputPath, verified: false }
	}

	const hash = await sha256File(outputPath)
	if (hash.toLowerCase() !== checksum.toLowerCase()) {
		throw new Error(
			`Checksum mismatch for ${fileName}. Expected ${checksum}, got ${hash}`,
		)
	}

	return { path: outputPath, verified: true, checksum }
}

export const findYtdlpBinary = () => {
	const platform = process.platform as string
	const arch = process.arch as string

	try {
		const binaryName: string = PLATFORM_MAPPINGS[platform][arch]

		const ytdlpPath = path.join(BIN_DIR, binaryName)

		if (!fs.existsSync(ytdlpPath)) {
			throw new Error("Ytdlp binary not found. Please download it first.")
		}
		return ytdlpPath
	} catch {
		return undefined
	}
}
