<script setup lang="ts">
import type { VideoProgress } from "ytdlp-nodejs"

const props = defineProps<{
	progress?: VideoProgress
}>()
</script>

<template>
	<AutoSizeTransition :open="!!props.progress">
		<div class="flex flex-col gap-2 pt-6">
			<UProgress
				:model-value="props.progress?.percentage ?? 0"
				:max="100"
				:color="props.progress?.status === 'finished' ? 'success' : 'primary'"
			/>
			<span class="text-xs text-muted">
				{{ $t("ETA") }}: {{ props.progress?.eta_str ?? "" }}
			</span>
		</div>
	</AutoSizeTransition>
</template>
