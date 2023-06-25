import Lexer from "./mod.ts";

const EXECUTION_COUNT = 200;
const REPETITION_COUNT = 10000;

const codePart = `
	plus(n1, n2) {
		return n1 + n2
	}
`;

const code = (() => {
	let finalText = codePart;
	for (let i = 0; i < REPETITION_COUNT; i++) {
		finalText = finalText + "\n" + codePart;
	}
	return finalText;
})();

function runLexer() {
	const start = performance.now();
	const _ = Lexer.Tokenize(code);
	const end = performance.now();

	return end - start;
}

const allResults = [];

for (let i = 0; i < EXECUTION_COUNT; i++) {
	allResults.push(runLexer());
}

const mediumExecutionTime = allResults.reduce((ac, n) => ac + n, 0) /
	EXECUTION_COUNT;

console.log("Tempo de execução:", mediumExecutionTime, "ms");
