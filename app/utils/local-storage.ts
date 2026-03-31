import type { DownloadFormSchema } from "~/pages/download.vue"

interface Stored {
	lastUrl: string
	lastFormat: DownloadFormSchema["format"]
	lastLocation: DownloadFormSchema["location"]
	customLocations: string[]
}
/**
 * Slim LocalStorage helper.
 * Given a key, returns the value.
 * Given a key and a value, sets the value and returns it.
 */
export function ls<L extends keyof Stored>(key: L): Stored[L] | null
export function ls<L extends keyof Stored>(key: L, value: Stored[L]): Stored[L]
export function ls<L extends keyof Stored>(
	key: L,
	value?: Stored[L],
): Stored[L] | null | void {
	return value === undefined
		? JSON.parse(localStorage.getItem(`dlpgui-${key}`) as string)
		: (localStorage.setItem(`dlpgui-${key}`, JSON.stringify(value)), value)
}

export const useLs = <L extends keyof Stored>(key: L) => {
	const value = ref(ls(key))

	watch(value, () => {
		ls(key, value.value)
	})

	return value
}
