const mapData = {};

for (const pack of game.packs) {
	if (pack.metadata.type !== "Item") continue;

	const itemMap = {};
	for (const item of pack.index) {
		itemMap[item._id] = {
			__ITEM_NAME__: item.name,
			img: item.img,
		};
	}

	mapData[pack.metadata.id] = itemMap;
}

console.log(mapData);
