export const presets = {
	mp3: ["-x", "--audio-format", "mp3"],
	mp4: ["-f", "b"],
	mp4_best: ["-f", "bv*+ba/b"],
} as const
