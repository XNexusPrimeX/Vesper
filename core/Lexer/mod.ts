import { BinaryOperators, TokenType } from "@constants";
import { Token } from "./structure.Token.ts";

export class Lexer {
	static Tokenize(code: string): Array<Token> {
		const lexer = new this();
		const tokens = new Array();
		const source = code.split("");

		const saveToken = (type: TokenType, value = "") =>
			tokens.push(new Token(type, value));

		while (source.length > 0) {
			if (source[0] == "(") {
				saveToken(TokenType.OpenParen);
				source.shift();
			} else if (source[0] == ")") {
				saveToken(TokenType.CloseParen);
				source.shift();
			} else if (source[0] == "{") {
				saveToken(TokenType.OpenBrace);
				source.shift();
			} else if (source[0] == "}") {
				saveToken(TokenType.CloseBrace);
				source.shift();
			} else if (source[0] == "@") {
				saveToken(TokenType.Decorator);
				source.shift();
			} else if (source[0] == ",") {
				saveToken(TokenType.Comma);
				source.shift();
			} else if (source[0] == "=") {
				saveToken(TokenType.Equals);
				source.shift();
			} else if (BinaryOperators.is(source[0])) {
				saveToken(TokenType.BinaryOperator, source.shift());
			} else {
				if (lexer.isInt(source[0])) {
					let num = "";
					while (source.length > 0 && lexer.isInt(source[0])) {
						num += source.shift();
					}
					saveToken(TokenType.Number, num);
				} else if (lexer.isAlpha(source[0])) {
					let ident = "";
					while (
						source.length > 0 &&
						(lexer.isAlpha(source[0]) || lexer.isInt(source[0]))
					) {
						ident += source.shift();
					}

					const reserved = false;
					if (reserved) {
						saveToken(TokenType.Keyword, ident);
					} else {
						saveToken(TokenType.Identifier, ident);
					}
				} else if (lexer.isSkippable(source[0])) {
					source.shift();
				} else {
					console.error(
						"Unreconized character found in source: ",
						source[0].charCodeAt(0),
						source[0],
					);
					Deno.exit(1);
				}
			}
		}

		saveToken(TokenType.EOF, "End of File");

		return tokens;
	}

	private isAlpha(source: string) {
		return source.toUpperCase() != source.toLowerCase();
	}
	private isSkippable(str: string) {
		return str == " " || str == "\n" || str == "\t";
	}
	private isInt(str: string) {
		const c = str.charCodeAt(0);
		const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
		return c >= bounds[0] && c <= bounds[1];
	}
}

export { Token };
export default Lexer;
