import React, { Fragment, useEffect, useState } from 'react';
import { kawiTestCases, testCases } from "./modules/testCases";
import { translate } from "./modules/translation";

const useSampleTestCases = true,
	useKawiTestCases = true;

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
