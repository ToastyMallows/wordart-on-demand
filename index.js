const wordartOnDemand = require('./wordartOnDemand');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
	{ name: 'word', alias: 'w', type: String },
	{ name: 'art', alias: 'a', type: String }
];

const arts = [
	'outline','up','arc','squeeze','inverted-arc','basic-stack',
	'italic-outline','slate','mauve','graydient','red-blue','brown-stack',
	'radial','purple','green-marble','rainbow','aqua','texture-stack',
	'paper-bag','sunset','tilt','blues','yellow-dash','green-stack',
	'chrome','marble-slab','gray-block','superhero','horizon','stack-3d'
];

(async () => {
	const options = commandLineArgs(optionDefinitions);

	if (!options.word || options.word === '') {
		throw new Error("--word (-w) is required");
	}
	
	if (options.art) {
		// generate one
		await wordartOnDemand.generateWordArt(options.word, options.art);
	} else {
		// generate all
		for (let index = 0; index < arts.length; index++) {
			const art = arts[index];
			await wordartOnDemand.generateWordArt(options.word, art);
		}
	}
})();