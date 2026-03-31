<script setup lang="ts">
import type { FormSubmitEvent, SelectItem } from "@nuxt/ui"
import type { VideoProgress } from "ytdlp-nodejs"

import z from "zod"

const getPathLast = (path: string) => {
	return path.split(/\\|\//g).at(-1) || path
}
const pickDirectory = async () => {
	const path = await electrobun.rpc?.request("getCustomFolderPath", {})
	if (!path?.output) {
		toast.add({
			title: $t("error"),
			description: $t("no custom folder selected"),
			color: "error",
		})

		state.location = "desktop"
		return
	}

	customLocations.value = [...(customLocations.value ?? []), path.output]

	state.location = path.output
}

const deleteCustomLocation = (path?: string) => {
	if (!path) return
	if (!customLocations.value) return

	customLocations.value = customLocations.value.filter((item) => item !== path)

	state.location = "desktop"

	toast.add({
		title: $t("deleted", { target: getPathLast(path) }),
		color: "success",
	})
}

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

const customLocations = useLs("customLocations")

const locations = computed(() => {
	const items: Extract<SelectItem, object>[] = [
		{
			label: "Desktop",
			value: "desktop",
			icon: "lucide:house",
		},
		{
			label: "Downloads",
			value: "downloads",
			icon: "lucide:download",
		},
		{
			label: "Documents",
			value: "documents",
			icon: "lucide:paperclip",
		},
		{
			label: "Music",
			value: "music",
			icon: "lucide:music",
		},
		{
			label: "Pictures",
			value: "pictures",
			icon: "lucide:image",
		},
		{
			label: "Videos",
			value: "videos",
			icon: "lucide:video",
		},
	]

	if (customLocations.value && customLocations.value.length > 0) {
		items.push({
			type: "separator",
		})

		for (const location of customLocations.value) {
			items.push({
				custom: true,
				label: getPathLast(location),
				value: location,
				icon: "lucide:folder-heart",
			})
		}
	}

	items.push(
		{
			type: "separator",
		},
		{
			label: $t("custom"),
			value: "custom",
			onSelect: pickDirectory,
			icon: "lucide:folder-plus",
		},
	)

	return items
})

const locationsIcon = computed(() => {
	return locations.value.find((item) => item.value === state.location)?.icon
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

const toast = useToast()
const onSubmit = async (event: FormSubmitEvent<DownloadFormSchema>) => {
	const { url, format } = event.data

	const result = await electrobun.rpc?.request("download", {
		url,
		// todo: let user configure output path
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

	toast.add({
		title: $t("downloaded"),
		description: result.filePaths.join("\n"),
		color: "success",
	})

	progress.value = undefined
}

watch(state, () => {
	ls("lastUrl", state.url)
	ls("lastFormat", state.format)
	ls("lastLocation", state.location)
})

const progress = ref<VideoProgress>()

onMounted(() => {
	electrobun.rpc?.addMessageListener("progress", ({ params }) => {
		progress.value = params.progress
	})
})
</script>

<template>
	<div class="flex flex-1 place-content-center place-items-center">
		<UCard>
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
			>
				<UFormField :label="$t('url')" name="url">
					<UInput
						v-model="state.url"
						type="url"
						:placeholder="`Download ${$t('url')}`"
						class="w-full min-w-85"
					/>
				</UFormField>

				<div class="grid w-full grid-cols-2 gap-2">
					<UFormField :label="$t('location')" name="location">
						<USelect
							v-model="state.location"
							:items="locations"
							:icon="locationsIcon"
							class="w-full"
							:ui="{ content: 'min-w-60' }"
						>
							<template #item-trailing="{ item }">
								<UButton
									variant="ghost"
									icon="lucide:x"
									size="xs"
									class="invisible group-hover:visible"
									v-if="item.custom"
									@click.prevent.capture="
										deleteCustomLocation(item.value as string)
									"
								/>
							</template>
						</USelect>
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

				<UButton type="submit" loading-auto icon="lucide:rocket">
					{{ $t("download") }}
				</UButton>
			</UForm>

			<ProgressDisplay class="mt-6" :progress="progress" v-if="progress" />
		</UCard>
	</div>
</template>
