<template>
	<UApp>
		<UHeader title="dlpgui" mode="drawer">
			<template #body>
				<UIcon class="w-full text-center text-5xl" name="lucide:construction" />
			</template>
		</UHeader>

		<UMain :ui="{ base: 'flex flex-col' }">
			<NuxtPage />
		</UMain>
	</UApp>
</template>
