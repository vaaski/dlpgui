<script setup lang="ts">
import type { VideoProgress } from "ytdlp-nodejs"

const props = defineProps<{
	progress: VideoProgress
}>()
</script>

<template>
	<div class="flex flex-col gap-2">
		<UProgress
			v-model="props.progress.percentage"
			:max="100"
			:color="props.progress.status === 'finished' ? 'success' : 'primary'"
		/>
		<span class="text-xs text-muted" v-if="props.progress.eta_str">
			{{ $t("ETA") }}: {{ props.progress.eta_str }}
		</span>
	</div>
</template>
