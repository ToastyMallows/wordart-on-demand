const wordartOnDemand = require('./lib/wordartOnDemand');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const { EOL } = require('os');

const arts = [
	'outline','up','arc','squeeze','inverted-arc','basic-stack',
	'italic-outline','slate','mauve','graydient','red-blue','brown-stack',
	'radial','purple','green-marble','rainbow','aqua','texture-stack',
	'paper-bag','sunset','tilt','blues','yellow-dash','green-stack',
	'chrome','marble-slab','gray-block','superhero','horizon','stack-3d'
];

const optionDefinitions = [
	{
		name: 'word',
		alias: 'w',
		type: String,
		typeLabel: '{underline string}',
		description: 'The word to turn into wordart (required, outputs to .\\out folder)'
	},
	{
		name: 'art',
		alias: 'a',
		type: String,
		typeLabel: '{underline string}',
		description: 'The art style to use. (optional, will generate all art styles if omitted)'
	},
	{
		name: 'help',
		alias: 'h',
		type: Boolean,
		description: 'Print this usage guide.'
	}
];

const sections = [
	{
		header: 'Wordart On Demand',
		content: 'Generate 90s wordart easily as a transparent PNG.'
	},
	{
		header: 'Options',
		optionList: optionDefinitions
	},
	{
		header: 'Art Values',
		content: `The following are all valid art styles to use for the --art argument:${EOL}${EOL}${arts.join(", ")}${EOL}${EOL}Run the following command to see all styles: {bold node index.js -w Example}`
	}
];

(async () => {
	const options = commandLineArgs(optionDefinitions);
	const usage = commandLineUsage(sections);

	if (options.help) {
		console.log(usage);
		return;
	}

	if (!options.word || options.word === '') {
		throw new Error("--word (-w) is required");
	}
	
	if (options.art) {
		if (arts.indexOf(options.art.toLowerCase()) === -1) {
			throw new Error("Art style not recognized, see --help for more information.")
		}
		// generate one
		await wordartOnDemand.generateWordArt(options.word, options.art);
	} else {
		// generate all
		for (let index = 0; index < arts.length; index++) {
			const art = arts[index];
			console.log(`Generating ${art} wordart...`);
			await wordartOnDemand.generateWordArt(options.word, art);
		}
	}
})();