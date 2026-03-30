import type { MyRPC } from "~~/shared/types/rpc"

import Electrobun, { Electroview } from "electrobun/view"

const rpc = Electroview.defineRPC<MyRPC>({
	handlers: {
		requests: {},
		messages: {},
	},
})

export const electrobun = new Electrobun.Electroview({ rpc })
