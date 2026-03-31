<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui"

const location = defineModel<string>()
const pickerOpen = defineModel("pickerOpen", { default: false })

const toast = useToast()

const customLocations = useLs("customLocations")

const getPathLast = (path: string) => {
	return path.split(/\\|\//g).at(-1) || path
}

const pickDirectory = async () => {
	pickerOpen.value = true
	const path = await electrobun.rpc?.request("getCustomFolderPath", {})
	pickerOpen.value = false

	if (path?.output) {
		customLocations.value = [...(customLocations.value ?? []), path.output]
		location.value = path.output
		console.log(path.output)
	} else {
		toast.add({
			title: $t("error"),
			description: $t("no custom folder selected"),
			color: "error",
		})

		location.value = "desktop"
	}
}

const deleteCustomLocation = (path?: string) => {
	if (!path) return
	if (!customLocations.value) return

	customLocations.value = customLocations.value.filter((item) => item !== path)

	location.value = "desktop"

	toast.add({
		title: $t("deleted", { target: getPathLast(path) }),
		color: "success",
	})
}

const locations = computed(() => {
	const items: Extract<SelectItem, object>[] = [
		{
			label: $t("Desktop"),
			value: "desktop",
			icon: "lucide:house",
		},
		{
			label: $t("Downloads"),
			value: "downloads",
			icon: "lucide:download",
		},
		{
			label: $t("Documents"),
			value: "documents",
			icon: "lucide:paperclip",
		},
		{
			label: $t("Music"),
			value: "music",
			icon: "lucide:music",
		},
		{
			label: $t("Pictures"),
			value: "pictures",
			icon: "lucide:image",
		},
		{
			label: $t("Videos"),
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
	return locations.value.find((item) => item.value === location.value)?.icon
})
</script>

<template>
	<USelect
		v-model="location"
		:items="locations"
		:icon="locationsIcon"
		class="w-full"
		:ui="{ content: 'min-w-60', item: 'items-center' }"
	>
		<template #item-trailing="{ item }">
			<UButton
				variant="ghost"
				icon="lucide:x"
				size="xs"
				class="invisible group-hover:visible"
				v-if="item.custom"
				@click.prevent.capture="deleteCustomLocation(item.value as string)"
			/>
		</template>
	</USelect>
</template>
