<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui"

const modelValue = defineModel<string>()

const toast = useToast()

const customLocations = useLs("customLocations")

const getPathLast = (path: string) => {
	return path.split(/\\|\//g).at(-1) || path
}

const pickDirectory = async () => {
	const path = await electrobun.rpc?.request("getCustomFolderPath", {})

	if (path?.output) {
		customLocations.value = [...(customLocations.value ?? []), path.output]
		modelValue.value = path.output
		console.log(path.output)
	} else {
		toast.add({
			title: $t("error"),
			description: $t("no custom folder selected"),
			color: "error",
		})

		modelValue.value = "desktop"
	}
}

const deleteCustomLocation = (path?: string) => {
	if (!path) return
	if (!customLocations.value) return

	customLocations.value = customLocations.value.filter((item) => item !== path)

	modelValue.value = "desktop"

	toast.add({
		title: $t("deleted", { target: getPathLast(path) }),
		color: "success",
	})
}

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
	return locations.value.find((item) => item.value === modelValue.value)?.icon
})
</script>

<template>
	<USelect
		v-model="modelValue"
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
