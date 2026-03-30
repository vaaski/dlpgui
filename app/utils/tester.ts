interface Stored {
	something: unknown
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
		? JSON.parse(localStorage.getItem(`prefix-${key}`) as string)
		: (localStorage.setItem(`prefix-${key}`, JSON.stringify(value)), value)
}

const wait = (t: number): Promise<void> => new Promise((r) => setTimeout(r, t))

const once = <A extends any[], R, T>(
	fn: (this: T, ...arg: A) => R,
): ((this: T, ...arg: A) => R | undefined) => {
	let done = false
	return function (this: T, ...args: A) {
		return done ? void 0 : ((done = true), fn.apply(this, args))
	}
}
