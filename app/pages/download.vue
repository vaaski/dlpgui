<script setup lang="ts">
import type { FormSubmitEvent, SelectItem } from "@nuxt/ui"
import type { VideoProgress } from "ytdlp-nodejs"

import z from "zod"

const toast = useToast()
const filePickerOpen = ref(false)
const formRef = useTemplateRef("form")

const formats = ref([
	{
		label: "MP3",
		value: "mp3",
		icon: "lucide:music",
	},
	{
		type: "separator",
	},
	{
		label: "MP4",
		value: "mp4",
		icon: "lucide:video",
	},
	{
		label: `MP4 (${$t("best quality")})`,
		value: "mp4_best",
		icon: "lucide:video",
	},
] satisfies SelectItem[])
const formatsIcon = computed(() => {
	return formats.value.find((item) => item.value === state.format)?.icon
})

const formatKeys = Object.keys(presets) as (keyof typeof presets)[]

const schema = z.object({
	url: z.url(),
	format: z.enum(formatKeys),
	location: z.string(),
})
export type DownloadFormSchema = z.output<typeof schema>

const state = reactive<DownloadFormSchema>({
	url: ls("lastUrl") ?? "",
	format: ls("lastFormat") ?? "mp4",
	location: ls("lastLocation") ?? "desktop",
})

const onSubmit = async (event: FormSubmitEvent<DownloadFormSchema>) => {
	const { url, format } = event.data

	const result = await electrobun.rpc?.request("download", {
		url,
		outputPath: state.location,
		preset: [...presets[format]],
	})

	if (!result) {
		toast.add({
			title: $t("error"),
			description: "Could not download file",
			color: "error",
		})
		return
	}

	state.url = ""

	const filePath = result.filePaths.at(0)

	toast.add({
		title: $t("downloaded"),
		description: result.filePaths.join("\n"),
		color: "success",
		actions: [
			{
				icon: "lucide:folder-open",
				label: $t("show in folder"),
				color: "neutral",
				variant: "subtle",
				onClick: filePath
					? () => {
							electrobun.rpc?.request("showItemInFolder", { path: filePath })
						}
					: undefined,
			},
		],
	})

	progress.value = undefined
}

watch(state, () => {
	ls("lastUrl", state.url)
	ls("lastFormat", state.format)
	ls("lastLocation", state.location)
})

watch(
	() => state.url,
	(newUrl) => {
		const result = youtubeIdRegex.exec(newUrl)

		if (result) {
			const [, id] = result
			state.url = `https://youtu.be/${id}`
		}
	},
)

const progress = ref<VideoProgress>()

onMounted(() => {
	electrobun.rpc?.addMessageListener("progress", ({ params }) => {
		progress.value = params.progress
	})
})

const pasteFromClipboard = async () => {
	const text = await electrobun.rpc?.request("getClipboard", {})
	if (!text?.output) return

	state.url = text.output
	formRef.value?.validate({})
}
</script>

<template>
	<div class="flex flex-1 place-content-center place-items-center">
		<UCard>
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
				:disabled="filePickerOpen"
				ref="form"
			>
				<UFormField :label="$t('url')" name="url">
					<UFieldGroup>
						<UInput
							v-model="state.url"
							type="url"
							:placeholder="`Download ${$t('url')}`"
							class="w-full min-w-85"
							:ui="{ trailing: 'pe-1' }"
						>
							<template v-if="state.url?.length" #trailing>
								<UButton
									color="neutral"
									variant="link"
									size="xs"
									icon="lucide:x"
									aria-label="Clear input"
									@click="state.url = ''"
									class="opacity-0 transition-opacity group-hover:opacity-100"
								/>
							</template>
						</UInput>

						<UTooltip :text="$t('Paste')">
							<UButton
								icon="lucide:clipboard"
								variant="subtle"
								size="sm"
								color="neutral"
								@click="pasteFromClipboard"
							/>
						</UTooltip>
					</UFieldGroup>
				</UFormField>

				<div class="grid w-full grid-cols-2 gap-2">
					<UFormField :label="$t('location')" name="location">
						<LocationPicker
							v-model="state.location"
							v-model:picker-open="filePickerOpen"
						/>
					</UFormField>

					<UFormField label="Format" name="format">
						<USelect
							v-model="state.format"
							:items="formats"
							:icon="formatsIcon"
							class="w-full"
						/>
					</UFormField>
				</div>

				<UButton
					type="submit"
					loading-auto
					icon="lucide:download"
					:disabled="filePickerOpen"
					class="mt-2 w-full"
					:variant="state.url.length > 0 ? 'solid' : 'subtle'"
					size="lg"
				>
					{{ $t("download") }}
				</UButton>
			</UForm>

			<ProgressDisplay :progress="progress" />
		</UCard>
	</div>
</template>
