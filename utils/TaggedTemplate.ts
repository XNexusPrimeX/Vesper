export function code(array: TemplateStringsArray) {
	let string = array[0];

	string.indexOf("\n") == 0 && (string = string.slice(1));

	// Encontra a quantidade de tabs na primeira linha
	const numTabs = string.match(/^\t*/)?.[0].length;

	// Remove a quantidade de tabs da primeira linha
	string = string.replace(/^\t*/, "");

	// Remove a quantidade de tabs de todas as outras linhas
	string = string.trimEnd().replace(new RegExp(`^\\t{0,${numTabs}}`, "gm"), "");

	return string;
}
