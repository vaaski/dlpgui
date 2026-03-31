<script setup lang="ts">
onMounted(async () => {
	await electrobun.rpc?.request("checkForUpdate", {})
	await electrobun.rpc?.request("ensureBinaries", {
		channel: ls("ytdlpChannel") ?? "stable",
	})
	navigateTo("/download", { replace: true })
})
</script>

<template>
	<div
		class="flex flex-1 flex-col place-content-center place-items-center gap-4"
	>
		<span class="ml-2">{{ $t("setting up...") }}</span>
		<UProgress animation="swing" class="max-w-100" />
	</div>
</template>
