import type { MyRPC } from "~~/shared/types/rpc"

import Electrobun, { Electroview } from "electrobun/view"

const rpc = Electroview.defineRPC<MyRPC>({
	maxRequestTime: 60e3,
	handlers: {
		requests: {},
		messages: {},
	},
})

export const electrobun = new Electrobun.Electroview({ rpc })
