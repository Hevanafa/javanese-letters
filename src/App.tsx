import React, { Fragment, useEffect, useState } from 'react';

const useSampleTestCases = true,
	useKawiTestCases = true;

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

	// Sanskrit consonants (missing conjuncts)
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

	// Rékan consonants (missing conjuncts)
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
// const numbers = [
// 	"꧐",
// 	"꧑",
// 	"꧒",
// 	"꧓",
// 	"꧔",
// 	"꧕",
// 	"꧖",
// 	"꧗",
// 	"꧘",
// 	"꧙"
// ];

const virama = "꧀",
	pangkon = virama;

const
	adegAdeg = "꧋",
	padaLingsa = "꧈",
	padaLungsi = "꧉";

// Done: vowels
// Done: Panyigeging wanda (-r, -h, -ng)
// Done: virama (pangkon)
// Done: special case "minggat" with ming + gat
// Done: conjuncts
// Done: Sanskrit letters
// Cancelled: Sanskrit conjuncts
// Done: special "ha" cases: ang, ing, ung, ingkang, and so on
// Todo: special case "hyang"
// Done: special case "ia"
// Todo: sandhangan wyanjana
// Todo: aksara swara
// Optional: long vowels
// Todo: helper symbol buttons (for long vowels)
// Done: numbers
// Todo: aksara murda

// Done: rewrite text parser, prioritise numbers
// Done: add a pangkon in between consonant clusters

// part of attempt 3
function getVowel(vowel: string) {
	return !vowel || !vowels[vowel] || vowel === "a"
		? ""
		: vowels[vowel];
}

function translate(str: string, paragraphMarks = false) {
	if (!str.length)
		return "";

	return (paragraphMarks ? adegAdeg : "") +
		str.trim().toLowerCase()

			// Take care of excessive spaces
			.replace(/\s+/, " ")

			// Punctuations
			.replace(/[-]/g, "")
			.replace(/,/g, padaLingsa)
			.replace(/\./g, padaLungsi)


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


			// Numbers
			.replace(/\d+/g, (match) =>
				"꧇" + match.split("").map(n =>
					numbers[Number(n)]
				).join("") + "꧇"
			)

			// .replace(/(dh|th|ny|ng|[b-df-hj-np-tv-z'])\b/g, match => {
			// 	// End of word
			// 	return match in syllableEnds
			// 		? syllableEnds[match]
			// 		: consonants[match] + virama;
			// })

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

			// This one's problematic
			// Condition: only apply this at the middle of a syllable
			// .replace(/(?<!^|\s|[aeiouèéê])([yrlw])([aeiouèéê])/, (_, cons, vowel) =>
			// 	sandhanganWyanjana[cons] + getVowel(vowel)
			// )

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

// sorted from easy to hard
const testCases = [
	"bata",
	"kayu",
	"dahan",
	"potelot",
	"méja karo kursi",
	"pintu",
	"minggat",
	"wit, wit-witan, godhong, oyot",
	"kucingku nduwé cemèng telu",
	"èmpèran",
	"èmpang",
	"Ramayana",
	"ingkang",
	"layar",
	"batur",
	"sekolahan",
	"wayah",
	"tirta",
	"tukang",
	"Purbalingga",
	"Majapahit",
	"aku tuku saté 10 sunduk",
	"budhal menyang sekolahan",
	"wayahé turu",
	"aku wis mangan",
	"kesel kakèhan penggawéyan",
	"guaken nang kana",
	"dadar gulung isiné klapa",

	"Krésna",
	"kroto",
	"hyang",
	"crah",
	"sandhangan wyanjana",
	"ngréwangi",
	"nglangi",
	"ngudut ganja",

	"mblénjani janji",
	"jangan mlinjo",
	"ngréwangi lan ngriwuki",

	// Sanskrit loanwords
	"śrī",
	"prakāśa",
	"samudra",
	"suvarṇabhūmi"
];

const kawiTestCases = [
	"Lamun sira ngingu kucing, awaké ireng sadaya, lambung kiwa tèmbong putih, leksan nira prayoga, aran wulan krahinan, tinekanan sasedyan nira ipun, yèn buṇḍel langkung utama.",

	"Jahnī yāhning talaga kadi langit, mambang tang pās wulan upamanikā, wintang tulya ng kusuma ya sumawur, lumrā pwekang sari kadi jalada.",
];

function App() {
	const
		[inputStr, setInputStr] = useState(""),
		[outputStr, setOutputStr] = useState("");

	// aeiou
	// [b-df-hj-np-tv-z]


	// Attempt 3
	useEffect(() => {
		setOutputStr(translate(inputStr));
	}, [inputStr]);


	// Attempt 2
	// function getVowel(vowel: string) {
	// 	return !vowel || !vowels[vowel]
	// 		? ""
	// 		: vowels[vowel];
	// }

	// function appendVowel(consonant = "h", vowel: string) {
	// 	return vowel === "a"
	// 			? consonants[consonant]
	// 			: vowel ? consonants[consonant] + vowels[vowel]
	// 				: consonants[consonant] + virama;
	// }

	// useEffect(() => {
	// 	const startingVowelRegex = /^[aeiouèéê]/;

	// 	let out = inputStr.replace(/\d+/g, (match) =>
	// 		"꧇" + match.split("").map(n => numbers[Number(n)]).join("") + "꧇"
	// 	).replace(/re/, sandhanganRe).trim();

	// 	out = out.split(" ").map(word => {
	// 		if (startingVowelRegex.test(word))
	// 			word = word.replace(startingVowelRegex, vowel =>
	// 				appendVowel("h", vowel)
	// 			);

	// 		// Todo: apply virama only for clusters in the middle of the sentence & also at the back
	// 		// Todo: need in-depth analysis about syllable clustering


	// 		word = word.replace(/(dh|th|ny|ng|[b-df-hj-np-tv-z']*)([aeiouèéê]?)/g,
	// 			(cluster, cons: string, vowel: string, offset, string) => {
	// 				if (!cons && !vowel)
	// 					return "";

	// 				const consCluster = (cons.match(/dh|th|ny|ng|[b-df-hj-np-tv-z']/g) || []);
	// 				console.log("consonants", consCluster, "vowel", vowel);

	// 				const consConv = consCluster.map((c) => consonants[c]);

	// 				// console.log("vowel", vowel)
	// 				// return appendVowel(cons, vowel);
	// 				// console.log("consConv", consConv);

	// 				if (consConv.length > 1 && vowel) {
	// 					if (vowel)
	// 						return consConv[0] + virama + getVowel(vowel) + (consCluster[1] in syllableEnds ? syllableEnds[consCluster[1]] : consConv[1]);
	// 					else return consConv[0] + virama + consConv[1];
	// 				} else {
	// 					if (vowel)
	// 						return consConv.join("") + getVowel(vowel);
	// 					else return (consCluster[1] in syllableEnds
	// 						? syllableEnds[consCluster[1]]
	// 						: consConv[1]);
	// 				}
	// 			});

	// 		return word;
	// 	}).join(" ")

	// 	if (/[^aeiouèéê]$/.test(out))
	// 		out += virama;

	// 	setOutputStr(out);
	// }, [inputStr]);

	// Attempt 1
	// useEffect(() => {
	// 	const
	// 		baseConsonantRegex = /dh|th|ny|ng|[b-df-hj-np-tv-z']/,
	// 		sanskritConsonantRegex = /kh|gh|ch|jh|ṭh|ḍh|ṇ|ph|bh|ś|ṣ|[ṭḍ]/,
	// 		vowelRegex = /[aeiouèéê]/,
	// 		combinedRegex = new RegExp("(" +
	// 			"(" + baseConsonantRegex.source + "|" +
	// 			sanskritConsonantRegex.source + ")" +
	// 			"(" + vowelRegex.source + ")?)", "g");

	// 	const clusters = (
	// 		inputStr.toLowerCase()
	// 			// .replace(/\s/g, "")
	// 			.match(combinedRegex) ?? []
	// 		// .match(/(||ḥ|kḥ|ḡ)()?/g) ?? [] // (ng|r|h)?
	// 	);

	// 	console.log("Clusters", clusters);

	// 	const clusterPairs = clusters.map(cluster =>
	// 		[
	// 			cluster.match(baseConsonantRegex),
	// 			cluster.match(vowelRegex)
	// 		]
	// 	);

	// 	const hasVowelAry = clusters.map(cluster => vowelRegex.test(cluster));

	// 	console.log("Clusters", clusters);

	// 	const out = clusterPairs.map((pair, idx) => {
	// 		const
	// 			[consonant, vowel] = pair,
	// 			consonantStr = consonant + "",
	// 			vowelStr = vowel + "",
	// 			consonantOnly = consonant && !vowel,
	// 			isFirstCluster = idx === 0,
	// 			isLastCluster = idx === clusters.length - 1;
	// 		// end = cluster.match(/ng|r|h/) + "";

	// 		const outAry = consonantOnly && consonantStr in syllableEnds ? [
	// 			syllableEnds[consonantStr]
	// 		] : isLastCluster && consonantOnly ? [
	// 			(consonantStr in consonants ? consonants[consonantStr] : ""),
	// 			"꧀"
	// 		] : [
	// 			!isFirstCluster &&
	// 				!hasVowelAry[idx - 1] &&
	// 				(!syllableEnds.hasOwnProperty(clusterPairs[idx - 1][0] + "")) &&
	// 				consonantStr in conjuncts
	// 				? conjuncts[consonantStr]
	// 				: consonantStr in consonants
	// 					? consonants[consonantStr] : "",
	// 			vowelStr === "o" ? "ꦺ" : vowelStr in vowels ? vowels[vowelStr] : "",
	// 			vowelStr === "o" ? "ꦴ" : "",
	// 			// end in syllableEnds ? syllableEnds[end] : ""
	// 		];

	// 		console.log(consonantStr, vowelStr, outAry);

	// 		// console.log(vowel, outAry);

	// 		return outAry.filter(x => x.length).join("");
	// 	});

	// 	setOutputStr(out.join(""));
	// }, [inputStr]);

	return (
		<div className="App">
			<div id="inputBox">
				Masukkan teks:
				<input onChange={(e) => {
					setInputStr(e.target.value);
				}} value={inputStr} />
			</div>

			<p>
				<b>Catatan:</b><br />
				Untuk kata-kata yg tidak diawali konsonan (contoh: "ing" atau "ingkang"), gunakan petik 1 ' sebelum menulis huruf vokal.<br />
				Untuk vokal yg menggunakan taling, gunakan huruf é atau è.
			</p>

			<p>
				<b>Output</b><br />

				<span style={{ fontSize: "30px" }}>
					{outputStr}
				</span>
			</p>

			{
				useSampleTestCases
					? <>
						<h3>
							Example Test Cases
						</h3>

						<table style={{ fontSize: "14px" }}>
							<thead>
								<tr>
									<td>Latin</td>
									<td>Javanese Script</td>
								</tr>
							</thead>
							<tbody>
								{testCases.map((item, idx) =>
									<tr key={`case_${idx}`}>
										<td>{item}</td>
										<td>{translate(item)}</td>
									</tr>
								)}
							</tbody>
						</table>
					</> : null}

			{
				useKawiTestCases
					?
					<>
						<h3>Kawi Test Cases</h3>

						{kawiTestCases.map((paragraph, idx) =>
							<Fragment key={`kawi_${idx}`}>
								<p>{paragraph}</p>
								<p>{translate(paragraph, true)}</p>
							</Fragment>
						)}
					</>
					: null
			}
		</div>
	);
}

export default App;
