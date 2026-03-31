import type { DownloadFormSchema } from "~/pages/download.vue"
import type { DownloadChannel } from "~~/shared/types/rpc"

interface Stored {
	lastUrl: string
	lastFormat: DownloadFormSchema["format"]
	lastLocation: DownloadFormSchema["location"]
	customLocations: string[]

	ytdlpChannel: DownloadChannel
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

export function useLs<L extends keyof Stored>(
	key: L,
	defaultValue: Stored[L],
): Ref<Stored[L]>
export function useLs<L extends keyof Stored>(
	key: L,
	defaultValue?: undefined,
): Ref<Stored[L] | undefined>
export function useLs<L extends keyof Stored>(
	key: L,
	defaultValue?: Stored[L],
) {
	const value = ref(ls(key) ?? defaultValue)

	watch(value, () => {
		ls(key, value.value)
	})

	return value
}
