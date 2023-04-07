import type { TokenType } from "@constants";

export class Token {
	constructor(
		public type: TokenType,
		public value: string,
	) {}
}
