export const sharedFlags = ["--no-playlist"]

export const presets = {
	mp3: [...sharedFlags, "-x", "--audio-format", "mp3"],
	mp4: [...sharedFlags, "-f", "b", "--remux-video", "mp4"],
	mp4_best: [...sharedFlags, "-f", "bv*+ba/b", "--remux-video", "mp4"],
} as const
