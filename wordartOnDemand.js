const puppeteer = require('puppeteer');
const magick = require('gm').subClass({imageMagick: true});
const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file');

const wordPlaceholder = '{word_placeholder}';
const artPlaceholder = '{art_placeholder}';
const tempWordFile = path.resolve('.\\temp\\temp.png');
const indexFile = path.resolve('.\\index.html');

function wordartOnDemand() { }

async function generateWordArt(word, art) {
	const tempIndexFile = path.resolve('.\\index_' + art + '_temp.html');

	fs.copyFileSync(indexFile, tempIndexFile);

	const wordReg = new RegExp(wordPlaceholder, 'g');
	const wordReplaceOptions = {
		files: tempIndexFile,
		from: wordReg,
		to: word
	};

	const artReg = new RegExp(artPlaceholder, 'g');
	const artReplaceOptions = {
		files: tempIndexFile,
		from: artReg,
		to: art
	};

	await replace.replaceInFile(wordReplaceOptions);
	await replace.replaceInFile(artReplaceOptions);

	const browser = await puppeteer.launch();

	const page = await browser.newPage();
	page.setViewport({
		width: 5000,
		height: 5000
	});
	page._emulationManager._client.send(
		'Emulation.setDefaultBackgroundColorOverride',
		{ color: { r: 0, g: 0, b: 0, a: 0 } }
	);

	await page.goto(tempIndexFile);

	await page.screenshot({ path: tempWordFile });
	
	await page.close();
	await browser.close();
	// TODO: Add timestamp
	const wordFile = path.resolve('.\\out\\wordart-' + art + '.png');

	magick(tempWordFile).trim().write(wordFile, (err) => {
		if (err) reject(err);
		//fs.unlinkSync(tempWordFile);
		//fs.unlinkSync(tempIndexFile);
	});
}

wordartOnDemand.generateWordArt = generateWordArt;

module.exports = wordartOnDemand;