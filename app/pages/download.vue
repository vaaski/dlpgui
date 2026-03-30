<script setup lang="ts">
import type { FormSubmitEvent, SelectItem } from "@nuxt/ui"

import z from "zod"

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

const formatKeys = Object.keys(presets) as (keyof typeof presets)[]
const schema = z.object({
	url: z.url(),
	format: z.enum(formatKeys),
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
	url: "https://youtu.be/dQw4w9WgXcQ",
	format: "mp3",
})

const toast = useToast()
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { url, format } = event.data

	const result = await electrobun.rpc?.request("download", {
		url,
		outputPath: "/Users/A200007423/Desktop",
		preset: [...presets[format]],
	})

	if (!result) {
		toast.add({
			title: "Error",
			description: "Could not download file",
			color: "error",
		})
		return
	}

	toast.add({
		title: "Downloaded",
		description: result.filePaths.join("\n"),
		color: "info",
	})
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
			>
				<UFormField :label="$t('url')" name="url">
					<UInput
						v-model="state.url"
						type="url"
						:placeholder="`Download ${$t('url')}`"
						class="min-w-85"
					/>
				</UFormField>

				<UFormField label="Format" name="format">
					<USelect v-model="state.format" :items="formats" />
				</UFormField>

				<UButton type="submit" loading-auto icon="lucide:rocket">
					{{ $t("download") }}
				</UButton>
			</UForm>
		</UCard>
	</div>
</template>
