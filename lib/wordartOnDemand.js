const puppeteer = require('puppeteer');
const magick = require('gm');
const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file');
const slugify = require('slugify');

const wordPlaceholder = '{word_placeholder}';
const artPlaceholder = '{art_placeholder}';
const indexFile = path.resolve('index.html');
const tempDir = path.resolve('temp');
const outDir = path.resolve('out');

function wordartOnDemand() { }

async function generateWordArt(word, art) {

	function escapeHtml(html) {
		return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	}

	function getTimestamp() {
		const date = new Date();
		return `${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
	}

	const wordEscaped = escapeHtml(word);
	const tempIndexFile = path.resolve(`index_${art}_${getTimestamp()}_temp.html`);

	fs.copyFileSync(indexFile, tempIndexFile);

	const wordReg = new RegExp(wordPlaceholder, 'g');
	const wordReplaceOptions = {
		files: tempIndexFile,
		from: wordReg,
		to: wordEscaped
	};

	const artReg = new RegExp(artPlaceholder, 'g');
	const artReplaceOptions = {
		files: tempIndexFile,
		from: artReg,
		to: art
	};

	await replace.replaceInFile(wordReplaceOptions);
	await replace.replaceInFile(artReplaceOptions);

	const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

	const page = await browser.newPage();
	page.setViewport({
		width: 5000,
		height: 5000
	});

	await page.goto('file://' + tempIndexFile);

	if (!fs.existsSync(tempDir)) {
		fs.mkdirSync(tempDir);
	}

	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir);
	}

	const fileType = "png";

	const tempWordFile = path.resolve(path.normalize(`${tempDir}${path.sep}temp_${getTimestamp()}.${fileType}`));

	await page.screenshot({
		path: tempWordFile,
		omitBackground: true,
		type: fileType
	});

	await page.close();
	await browser.close();

	const wordFileName = `wordart-${art}-${slugify(word).substring(0, 20)}.${fileType}`;
	const wordFile = path.resolve(path.normalize(`${outDir}${path.sep}${wordFileName}`));

	magick(tempWordFile).trim().write(wordFile, (err) => {
		if (err) throw err;
		fs.unlinkSync(tempWordFile);
		fs.unlinkSync(tempIndexFile);
	});
}

wordartOnDemand.generateWordArt = generateWordArt;

module.exports = wordartOnDemand;