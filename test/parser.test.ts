import { Parser } from "../src/parser.ts";

Deno.test("Declare Functions", () => {
	const parser = new Parser();

	const program = parser.produceAST("myFunc(n1, n2) {}");

	console.log(program);
});
