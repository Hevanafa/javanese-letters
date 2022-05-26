// main translation module

type StringDict = { [key: string]: string };

const consonants: StringDict = {
	"'": "ꦲ",
	h: "ꦲ",
	n: "ꦤ",
	c: "ꦕ",
	r: "ꦫ",
	k: "ꦏ",
	d: "ꦢ",
	t: "ꦠ",
	s: "ꦱ",
	w: "ꦮ",
	v: "ꦮ",
	l: "ꦭ",
	p: "ꦥ",
	dh: "ꦝ",
	j: "ꦗ",
	y: "ꦪ",
	ny: "ꦚ",
	m: "ꦩ",
	g: "ꦒ",
	b: "ꦧ",
	th: "ꦛ",
	ng: "ꦔ",

	// Sanskrit consonants
	kh: "ꦏ",
	gh: "ꦑ",
	ch: "ꦒ",
	jh: "ꦓ",
	ṭ: "ꦛ",
	ṭh: "ꦜ",
	ḍ: "ꦝ",
	ḍh: "ꦞ",
	ṇ: "ꦟ",
	ph: "ꦦ",
	bh: "ꦨ",
	ś: "ꦯ",
	ṣ: "ꦰ",

	// Rékan consonants
	ḥ: "ꦲ꦳",
	kḥ: "ꦏ꦳",
	q: "ꦐ",
	dz: "ꦢ꦳",
	sy: "ꦱ꦳",
	f: "ꦥ꦳",
	z: "ꦗ꦳",
	ḡ: "ꦒ꦳",
	"`": "ꦔ꦳"
};

const vowels: StringDict = {
	i: "ꦶ",
	u: "ꦸ",
	é: "ꦺ",
	è: "ꦺ",
	ê: "ꦼ",
	e: "ꦼ",
	o: "ꦺꦴ", // special case: [ "ꦏ", "ꦺ", "ꦴ" ]

	// Sanskrit & long vowels
	ā: "ꦴ",
	ī: "ꦷ",
	ū: "ꦹ",
	ai: "ꦻ",
	au: "ꦻꦴ"
};

// only used in the middle or at the end of the whole text
const syllableEnds: StringDict = {
	ng: "ꦁ",
	r: "ꦂ",
	h: "ꦃ"
};

const conjuncts: StringDict = {
	h: "꧀ꦲ",
	n: "꧀ꦤ",

	c: "꧀ꦕ",

	r: "꧀ꦫ",
	k: "꧀ꦏ",
	d: "꧀ꦢ",
	t: "꧀ꦠ",
	s: "꧀ꦱ",
	w: "꧀ꦮ",
	v: "꧀ꦮ",

	l: "꧀ꦭ",
	p: "꧀ꦥ",
	dh: "꧀ꦝ",

	j: "꧀ꦗ",
	y: "꧀ꦪ",
	ny: "꧀ꦚ",

	m: "꧀ꦩ",
	g: "꧀ꦒ",
	b: "꧀ꦧ",

	th: "꧀ꦛ",

	ng: "꧀ꦔ"
};

const sandhanganRe = "ꦽ";

const sandhanganWyanjana: StringDict = {
	// special case "re": ꦽ 
	y: "ꦾ",

	r: "ꦿ",
	l: "꧀ꦭ",
	w: "꧀ꦮ"
}

const numbers = "꧐꧑꧒꧓꧔꧕꧖꧗꧘꧙";

const virama = "꧀",
	pangkon = virama;

const
	adegAdeg = "꧋",
	padaLingsa = "꧈",
	padaLungsi = "꧉";

// part of attempt 3
function getVowel(vowel: string) {
	return !vowel || !vowels[vowel] || vowel === "a"
		? ""
		: vowels[vowel];
}

function punctuate(str: string) {
	if (!str.length)
		return "";

	return str
		.replace(/[-]/g, "")
		.replace(/,/g, padaLingsa)
		.replace(/\./g, padaLungsi)
}

function correctDigraphs(str: string) {
	return str
		// Insert extra letters for correction 
		.replace(/(?<=^|\s)[aeiouèéê]/g, match =>
			// the case of initial vowel
			`h${match}`
		)

		// the case of "nj" digraph
		// wyanjana --> wyany + jana
		// ganjaran --> gany + jaran
		.replace(/nj/g, "nyj")

		// ea, ia & ua diphthongs
		.replace(/ea|ia/g, match =>
			match[0] + "y" + match[1]
		)
		.replace(/ua/g, match =>
			match[0] + "w" + match[1]
		)
}

function translateNumbers(str: string) {
	return str
		.replace(/\d+/g, (match) =>
			"꧇" + match.split("").map(n =>
				numbers[Number(n)]
			).join("") + "꧇"
		);
}

const
	basicDigraphRegex = /(dh|th|ny|ng)/,
	basicVowelRegex = /([aeiouèéê])/,
	negativeLookaheadVowelRegex = /(?![aeiouèéê])/,
	basicConsonantRegex = /([b-df-hj-np-tv-z'])/,

	// semivowel (only written in the middle of a syllable)
	sandhanganWyanjanaRegex = /([lrwy])/;


// Sanskrit regexes
// Extended from the basic version
const
	// sanskritDigraphRegex = /(kh|gh|ch|jh|ṭh|ḍh|ph|bh)/,
	sanskritDigraphRegex = /(dh|th|ny|ng|kh|gh|ch|jh|ṭh|ḍh|ph|bh)/,
	// sanskritConsonantRegex = /([ṇśṣṭḍ])/;
	sanskritConsonantRegex = /([b-df-hj-np-tv-z'ṇśṣṭḍ])/,
	sanskritVowelRegex = /(ai|au|[aeiouèéêāīū])/,
	negativeLookaheadSanskritVowelRegex = /(?!ai|au|[aeiouèéêāīū])/;

// mnemonics
// const
// 	badirex = basicDigraphRegex,
// 	bavorex = basicVowelRegex,
// 	neglavorex = negativeLookaheadVowelRegex,
// 	baconsrex = basicConsonantRegex;


function joinRegexSources(...ary: RegExp[]) {
	return ary.map(r => r.source).join("");
}

function newGlobalRegex(...ary: RegExp[]) {
	return new RegExp(joinRegexSources(...ary), "g");
}

function combineRegexGroupSources(...ary: RegExp[]) {
	return "(" + ary.map(r => r.source).join("").replace(/[()]/, "") + ")";
}


export function translate(str: string, paragraphMarks = false) {
	if (!str.length)
		return "";

	str = str.trim().toLowerCase()
		// Take care of excessive spaces
		.replace(/\s+/, " ");

	str = punctuate(str);
	str = correctDigraphs(str);
	str = translateNumbers(str);

	return (paragraphMarks ? adegAdeg : "") +
		str

			// take care of double letters
			.replace(
				// /(dh|th|ny|ng)([lrwy])([aeiouèéê])/g,
				newGlobalRegex(
					// basicDigraphRegex,
					sanskritDigraphRegex,
					sandhanganWyanjanaRegex,

					// basicVowelRegex
					sanskritVowelRegex
				),

				(_, frontCons, midCons, vowel) =>
					// Sandhangan wyanjana
					consonants[frontCons] + sandhanganWyanjana[midCons] + getVowel(vowel)
			)
			.replace(
				// /(dh|th|ny|ng)(?![aeiouèéê])/g,
				newGlobalRegex(
					// basicDigraphRegex,
					sanskritDigraphRegex,

					// negativeLookaheadVowelRegex
					negativeLookaheadSanskritVowelRegex
				),
				match =>
					// End of syllable

					match in syllableEnds
						? syllableEnds[match]
						: consonants[match] + virama
			)
			.replace(
				// /(dh|th|ny|ng)([aeiouèéê])/g,
				newGlobalRegex(
					// basicDigraphRegex,
					sanskritDigraphRegex,

					// basicVowelRegex
					sanskritVowelRegex
				),
				(_, consonant, vowel) =>
					// Normal consonant + vowel
					consonants[consonant] + getVowel(vowel)
			)

			.replace(/(?<!^|\s|[aeiouèéê])re/g, sandhanganRe)

			// take care of single letters
			.replace(
				// /([b-df-hj-np-tv-z'])([lrwy])([aeiouèéê])/g,
				newGlobalRegex(
					// basicConsonantRegex,
					sanskritConsonantRegex,
					sandhanganWyanjanaRegex,

					// basicVowelRegex
					sanskritVowelRegex
				),
				(_, frontCons, midCons, vowel) =>
					// sandhangan wyanjana
					consonants[frontCons] + sandhanganWyanjana[midCons] + getVowel(vowel)
			)
			.replace(
				// /([b-df-hj-np-tv-z'])(?![aeiouèéê])/g,
				newGlobalRegex(
					// basicConsonantRegex,
					sanskritConsonantRegex,

					// negativeLookaheadVowelRegex
					negativeLookaheadSanskritVowelRegex
				),
				match =>
					// End of syllable

					match in syllableEnds
						? syllableEnds[match]
						: consonants[match] + virama
			)

			.replace(
				// /([b-df-hj-np-tv-z'])([aeiouèéê])/g,
				newGlobalRegex(
					// basicConsonantRegex,
					sanskritConsonantRegex,

					// basicVowelRegex
					sanskritVowelRegex
				),
				(_, consonant, vowel) =>
					// Normal consonant + vowel
					consonants[consonant] + getVowel(vowel)
			)

			// take care of extra spaces
			.replace(/\s/g, "")
			.replace(new RegExp(`(.${virama})(.${virama})`, "g"), (_, _1, _2) => 
				`${_1} ${_2}`
			);
}
