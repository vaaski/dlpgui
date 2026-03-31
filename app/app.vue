<script setup lang="ts">
import * as locales from "@nuxt/ui/locale"

const { locale } = useI18n()

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

useHead({
	htmlAttrs: { lang, dir },
})

const closeWindow = () => {
	electrobun.rpc?.send("windowClose", {})
}

const platform = ref("unknown")

onMounted(async () => {
	const platformResponse = await electrobun.rpc?.request("getPlatform", {})
	if (platformResponse?.output) {
		platform.value = platformResponse.output
	}
})
</script>

<template>
	<UApp :locale="locales[locale]">
		<UHeader
			title="dlpgui"
			:toggle="false"
			to="/download"
			class="electrobun-webkit-app-region-drag"
			:ui="{
				left: 'electrobun-webkit-app-region-no-drag',
				right: 'electrobun-webkit-app-region-no-drag',
			}"
		>
			<template #right>
				<UButton
					to="/settings"
					color="neutral"
					variant="ghost"
					icon="lucide:settings"
					size="sm"
					class="opacity-75"
				/>
				<!-- <UButton
					color="neutral"
					variant="ghost"
					icon="material-symbols:chrome-minimize-rounded"
				/>
				<UButton
					color="neutral"
					variant="ghost"
					icon="material-symbols:chrome-maximize-outline"
				/> -->
				<UButton
					color="neutral"
					variant="ghost"
					icon="material-symbols:close-rounded"
					size="xl"
					@click="closeWindow"
					class="ml-4"
					v-if="platform !== 'darwin'"
				/>
			</template>
		</UHeader>

		<UMain :ui="{ base: 'flex flex-col' }">
			<NuxtPage />
		</UMain>
	</UApp>
</template>
