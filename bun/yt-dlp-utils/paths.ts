import * as path from "node:path"

import { Utils } from "electrobun"

import config from "../../electrobun.config"

export const BIN_DIR = path.join(
	Utils.paths.appData,
	config.app.identifier,
	"bin",
)
