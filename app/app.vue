<script setup lang="ts">
import * as locales from "@nuxt/ui/locale"

const { locale } = useI18n()

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

useHead({
	htmlAttrs: { lang, dir },
})
</script>

<template>
	<UApp :locale="locales[locale]">
		<UHeader title="dlpgui" :toggle="false" to="/download">
			<template #right>
				<UButton
					to="/settings"
					color="neutral"
					variant="ghost"
					icon="lucide:settings"
				/>
			</template>
		</UHeader>

		<UMain :ui="{ base: 'flex flex-col' }">
			<NuxtPage />
		</UMain>
	</UApp>
</template>
