import Lexer from "../src/lexer.ts";
import { code } from "../utils/TaggedTemplate.ts";

Deno.test("Testing Paren and Binary Operations", () => {
	const tokens = Lexer.Tokenize("(3 + 8) * 3 / 1 - 5");

	console.log(tokens);
});

Deno.test("Class and Decorator", () => {
	const string = code`
		@Decorator
		MyClass {}	
	`;

	const tokens = Lexer.Tokenize(string);

	console.log(tokens);
});

Deno.test("Function", () => {
	const tokens = Lexer.Tokenize("myFunc(n1, n2) {}");

	console.log(tokens);
});
