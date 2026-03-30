<script setup lang="ts">
onMounted(async () => {
	await electrobun.rpc?.request("ensureBinaries", {})
	navigateTo("/download")
})
</script>

<template>
	<div class="flex flex-1 place-content-center place-items-center">
		<UIcon name="lucide:loader" class="animate-spin" />
		<span class="ml-2">{{ $t("setting up...") }}</span>
	</div>
</template>
