import { BinaryOperators, Keywords, TokenType } from "@constants";
import { Token } from "./structure.Token.ts";

class ListNode {
	constructor(public token: Token, public next: ListNode | null = null) {}
}

export class Lexer {
	static Tokenize(code: string): Token[] {
		let head: ListNode | null = null;
		let tail: ListNode | null = null;
		let currentIndex = 0;
		const sourceLength = code.length;

		const saveToken = (type: TokenType, value = "") => {
			const token = new Token(type, value);
			const newNode = new ListNode(token);

			if (!head) {
				head = newNode;
				tail = newNode;
			} else {
				tail!.next = newNode;
				tail = newNode;
			}
		};

		const advance = () => {
			currentIndex++;
		};

		const currentChar = () => {
			return code[currentIndex];
		};

		const isAlpha = (char: string) => {
			return char.toUpperCase() !== char.toLowerCase();
		};

		const isSkippable = (char: string) => {
			return char === " " || char === "\n" || char === "\t";
		};

		const isInt = (char: string) => {
			const charCode = char.charCodeAt(0);
			return charCode >= "0".charCodeAt(0) && charCode <= "9".charCodeAt(0);
		};

		while (currentIndex < sourceLength) {
			const current = currentChar();

			if (current === "(") {
				saveToken(TokenType.OpenParen);
				advance();
			} else if (current === ")") {
				saveToken(TokenType.CloseParen);
				advance();
			} else if (current === "{") {
				saveToken(TokenType.OpenBrace);
				advance();
			} else if (current === "}") {
				saveToken(TokenType.CloseBrace);
				advance();
			} else if (current === "@") {
				saveToken(TokenType.Decorator);
				advance();
			} else if (current === ",") {
				saveToken(TokenType.Comma);
				advance();
			} else if (current === "=") {
				saveToken(TokenType.Equals);
				advance();
			} else if (current == "'" || current == '"') {
				const quoteType = current as `"` | "'";

				advance(); // move past the opening quote
				let string = "";
				while (currentChar() !== quoteType) {
					string += currentChar();
					advance();
				}
				advance(); // move past the closing quote

				saveToken(TokenType.String, string);
			} else if (BinaryOperators.is(current)) {
				saveToken(TokenType.BinaryOperator, current);
				advance();
			} else {
				if (isInt(current)) {
					let num = "";
					while (currentIndex < sourceLength && isInt(currentChar())) {
						num += currentChar();
						advance();
					}
					saveToken(TokenType.Number, num);
				} else if (isAlpha(current)) {
					let ident = "";
					while (
						currentIndex < sourceLength &&
						(isAlpha(currentChar()) || isInt(currentChar()))
					) {
						ident += currentChar();
						advance();
					}

					// TODO: Losing performance here
					if (Keywords.hasOwnProperty(ident)) {
						saveToken(TokenType.Keyword, ident);
					} else {
						saveToken(TokenType.Identifier, ident);
					}
				} else if (isSkippable(current)) {
					advance();
				} else {
					// TODO: Losing performance here
					console.error(
						"Unrecognized character found in source: ",
						current.charCodeAt(0),
						current,
					);
					Deno.exit(1);
				}
			}
		}

		saveToken(TokenType.EOF);

		// Converter a lista encadeada em um array
		const tokens: Token[] = [];
		let currentNode: ListNode | null = head;
		while (currentNode) {
			tokens.push((currentNode as ListNode).token);
			currentNode = (currentNode as ListNode).next;
		}

		return tokens;
	}
}

export { Token };
export default Lexer;
