Reference: https://en.wikipedia.org/wiki/Javanese_script

# Added 24-05-2022

Rewrite the text parser with a different priority (this order):
- add "h" before every vowel that starts a word: "ing" --> "hing", but this will fail aksara swara
- numbers
- syllable ends
- sandhangan wyanjana
- consonant cluster: consonants at the front with vowel (also append with virama)
- basic consonants

"trenggiling"
ta + -re + cecak + ga + wulu + la + wulu + cecak

Example test cases:
- bata
- kayu
- dahan
- potelot
- meja
- kursi
- pintu
- wit
- wit-witan
- godhong
- Krésna
- Ramayana
- ingkang
- layar
- batur
- sekolahan
- wayah
- kroto
- hyang
- tirta
- Purbalingga
- Majapahit
- budhal menyang sekolahan
- wayahé turu
- aku wis mangan

- (Sanskrit-derived words)

Consider the "ha" case wherever a word starts without a consonant
ing --> ha + wulu + cecak
ingkang --> ha + wulu + cecak + ka + cecak


# Added 25-05-2022

## Regex Word Boundary failure

(Edit) This one fails: the case with the letters "è" & "é", or any other Unicode characters, /u flag is required
Word boundary (\b) in JS is only this: [a-zA-Z0-9_] (ref: https://stackoverflow.com/questions/5436824/matching-accented-characters-with-javascript-regexes)
Change the starting word boundary into this: (?<=^|\s)
	Explanation:
	(?<=)   positive lookbehind
		(ref: https://stackoverflow.com/questions/2973436/regex-lookahead-lookbehind-and-atomic-groups)
		(ref: https://www.rexegg.com/regex-lookarounds.html)
	^|\s    either start of string or after whitespace
		(ref: https://stackoverflow.com/questions/15669557/regex-match-pattern-as-long-as-its-not-in-the-beginning)


The case with diphthongs:
- "ea" or "ia": add -y- in the middle
- "ua": add -w- in the middle

The case of "nj" digraph:
	Correction: Convert to "ny" + "j"
	Example words: wyanjana, njalari, kanjeng

The case of "guaken"
	usually the input is like this: "guak en" or "gua'en"
	(transitive imperative)
	Correction: always add "k" before "en"
	Example cases:
		"guak en" --> "guaken"
		"gua' en" --> "guaken"
		"gua'en" --> "guaken"


My friend recommended me to make a mobile app for this, because it's not too practical using a "pepak" (something like a guide book / glossary book for Javanese language).


Outputs that are found wrong with these inputs (before panyigeg):
- Krésna
- kroto
- hyang
- sandhangan wyanjana
	maybe the "nwy" cluster confuses the parser
- mblenjani kanca
		"mbl" cluster
- jangan mlinjo
		"nml" cluster
- ngréwangi lan ngriwuki
- crah


Outputs that are wrong after panyigeg:
- mblénjani janji
	"mblé" cluster
- jangan mlinjo
	"nmli" cluster
- ngréwangi lan ngriwuki
	"nngri" cluster
- Kawi: aran wulan krahinan
	"nkra" cluster


Stop development before refactoring

Save this project to an online repository

Refactor `translate` function into smaller functions like:
	- corrections
	- convertPunctuations
	- convertNumbers
	- convertDigraphs
	- convertSingles