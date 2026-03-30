export default defineAppConfig({
	ui: {
		colors: {
			primary: "rose",
			neutral: "mauve",
		},
		select: {
			slots: {
				content: "min-w-fit",
				trailingIcon:
					"group-data-[state=open]:rotate-180 transition-transform duration-200",
			},
		},
	},
})
