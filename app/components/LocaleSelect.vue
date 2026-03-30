<script setup lang="ts">
import * as locales from "@nuxt/ui/locale"

const { locale, setLocale, localeCodes } = useI18n()

const availableLocales = computed(() => {
	return localeCodes.value.map((code) => {
		return locales[code]
	})
})
</script>

<template>
	<ULocaleSelect
		:model-value="locale"
		:locales="availableLocales"
		@update:model-value="setLocale($event as typeof locale)"
		class="w-48"
	/>
</template>
