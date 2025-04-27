export function diceSoNiceReadyHook(dice3d) {
	fallout.debug("Running diceSoNiceReady hook");

	dice3d.addSystem({ id: "fallout", name: "Fallout 2d20" }, true);

	dice3d.addColorset({
		name: "fallout",
		description: "Fallout 2d20",
		category: "Colors",
		foreground: "#fcef71",
		background: "#008cd1",
		outline: "gray",
		texture: "none",
	});

	dice3d.addDicePreset({
		type: "dc",
		labels: [
			"systems/fallout/assets/dice/d1.webp",
			"systems/fallout/assets/dice/d2.webp",
			"systems/fallout/assets/dice/d3.webp",
			"systems/fallout/assets/dice/d4.webp",
			"systems/fallout/assets/dice/d5.webp",
			"systems/fallout/assets/dice/d6.webp",
		],
		system: "fallout",

	});

	dice3d.addDicePreset({
		type: "dh",
		fontScale: 0.9,
		labels: [
			"systems/fallout/assets/dice-locations/head.webp",
			"systems/fallout/assets/dice-locations/head.webp",
			"systems/fallout/assets/dice-locations/body.webp",
			"systems/fallout/assets/dice-locations/body.webp",
			"systems/fallout/assets/dice-locations/body.webp",
			"systems/fallout/assets/dice-locations/body.webp",
			"systems/fallout/assets/dice-locations/body.webp",
			"systems/fallout/assets/dice-locations/body.webp",
			"systems/fallout/assets/dice-locations/arm-l.webp",
			"systems/fallout/assets/dice-locations/arm-l.webp",
			"systems/fallout/assets/dice-locations/arm-l.webp",
			"systems/fallout/assets/dice-locations/arm-r.webp",
			"systems/fallout/assets/dice-locations/arm-r.webp",
			"systems/fallout/assets/dice-locations/arm-r.webp",
			"systems/fallout/assets/dice-locations/leg-l.webp",
			"systems/fallout/assets/dice-locations/leg-l.webp",
			"systems/fallout/assets/dice-locations/leg-l.webp",
			"systems/fallout/assets/dice-locations/leg-r.webp",
			"systems/fallout/assets/dice-locations/leg-r.webp",
			"systems/fallout/assets/dice-locations/leg-r.webp",
		],
		system: "fallout",
		colorset: "fallout",
	});

}
