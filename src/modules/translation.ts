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
			.replace(/(dh|th|ny|ng)([yrlw])([aeiouèéê])/, (_, frontCons, wyanjana, vowel) =>
				// Sandhangan wyanjana
				consonants[frontCons] + sandhanganWyanjana[wyanjana] + getVowel(vowel)
			)
			.replace(/(dh|th|ny|ng)(?![aeiouèéê])/g, match => {
				// End of syllable

				return match in syllableEnds
					? syllableEnds[match]
					: consonants[match] + virama;
			})
			.replace(/(dh|th|ny|ng)([aeiouèéê])/g, (match, consonant, vowel) => {
				// Normal consonant + vowel
				// console.log("final cons & vowel", consonant, vowel);

				return consonants[consonant] + getVowel(vowel);
			})

			.replace(/(?<!^|\s|[aeiouèéê])re/g, sandhanganRe)

			// take care of single letters
			.replace(/([b-df-hj-np-tv-z'])([yrlw])([aeiouèéê])/, (_, frontCons, wyanjana, vowel) =>
				// sandhangan wyanjana
				consonants[frontCons] + sandhanganWyanjana[wyanjana] + getVowel(vowel)
			)
			.replace(/([b-df-hj-np-tv-z'])(?![aeiouèéê])/g, match => {
				// End of syllable

				// console.log("consonant w/o vowel", match);

				return match in syllableEnds
					? syllableEnds[match]
					: consonants[match] + virama;
				// return consonants[match] + virama;
			})

			.replace(/([b-df-hj-np-tv-z'])([aeiouèéê])/g, (match, consonant, vowel) => {
				// Normal consonant + vowel
				// console.log("final cons & vowel", consonant, vowel);

				return consonants[consonant] + getVowel(vowel);
			})

			// take care of extra spaces
			.replace(/\s/g, "");
}
