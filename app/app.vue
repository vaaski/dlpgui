<script setup lang="ts">
import * as locales from "@nuxt/ui/locale"

const { locale, setLocale, localeCodes } = useI18n()

const availableLocales = computed(() => {
	return localeCodes.value.map((code) => {
		return locales[code]
	})
})

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

useHead({
	htmlAttrs: { lang, dir },
})
</script>

<template>
	<UApp :locale="locales[locale]">
		<UHeader title="dlpgui" :toggle="false">
			<template #right>
				<ULocaleSelect
					:model-value="locale"
					:locales="availableLocales"
					@update:model-value="setLocale($event as typeof locale)"
					class="w-48"
				/>
			</template>
		</UHeader>

		<UMain :ui="{ base: 'flex flex-col' }">
			<NuxtPage />
		</UMain>
	</UApp>
</template>
