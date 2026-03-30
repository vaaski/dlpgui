<script setup lang="ts">
const toast = useToast()

type Setting = {
	label: string
	executor: Function | "language"
}

const getVersion = async (type: "yt-dlp" | "ffmpeg") => {
	const version = await electrobun.rpc?.request("getVersion", {
		type,
	})

	if (!version?.output) {
		toast.add({
			title: $t("error"),
			description: $t("could not get version", { type }),
			color: "error",
		})
		return
	}

	toast.add({
		title: `Version (${type})`,
		description: version.output,
		color: "info",
	})
}

const settings = [
	{
		label: $t("language"),
		executor: "language",
	},
	{
		label: $t("get version", { type: "yt-dlp" }),
		executor: () => getVersion("yt-dlp"),
	},
	{
		label: $t("get version", { type: "ffmpeg" }),
		executor: () => getVersion("ffmpeg"),
	},
] satisfies Setting[]
</script>

<template>
	<UCard class="m-4">
		<div
			v-for="setting in settings"
			:key="setting.label"
			class="mx-2 my-4 flex place-content-between place-items-center"
		>
			<div>
				<h2 class="text-lg font-bold">{{ setting.label }}</h2>
			</div>
			<div>
				<UButton
					@click="setting.executor"
					loading-auto
					v-if="typeof setting.executor === 'function'"
				>
					{{ $t("execute") }}
				</UButton>
				<div v-else-if="setting.executor === 'language'">
					<LocaleSelect />
				</div>
				<span v-else>{{ $t("not available") }}</span>
			</div>
		</div>
	</UCard>
</template>
