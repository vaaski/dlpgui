export const presets = {
	mp3: ["-x", "--audio-format", "mp3"],
	mp4: ["-f", "b", "--remux-video", "mp4"],
	mp4_best: ["-f", "bv*+ba/b", "--remux-video", "mp4"],
} as const
