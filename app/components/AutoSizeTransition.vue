<script setup lang="ts">
import { useElementSize } from "@vueuse/core"
import { computed, ref, type PropType } from "vue"

const props = defineProps({
	open: Boolean,
	direction: {
		type: String as PropType<"horizontal" | "vertical" | "both">,
		default: "vertical",
	},
})

const content = ref<HTMLElement | null>(null)

const { width, height } = useElementSize(content)

const wrapperStyle = computed(() => {
	const styles: Record<string, string> = {}

	if (props.direction === "vertical" || props.direction === "both") {
		styles.height = props.open ? `${height.value}px` : "0px"
	}

	if (props.direction === "horizontal" || props.direction === "both") {
		styles.width = props.open ? `${width.value}px` : "0px"
	}

	return styles
})
</script>

<template>
	<div
		:style="wrapperStyle"
		class="overflow-hidden transition-all duration-200 ease-in-out"
	>
		<div ref="content">
			<slot />
		</div>
	</div>
</template>
