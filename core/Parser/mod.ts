import { BinaryOperators, TokenType as TT } from "@constants";
import { Lexer, Token } from "../Lexer";

import { Expr, Program, Stmt } from "./structures.ts";
import * as Expressions from "./expressions.ts";

class TokenManager {
	protected tokens: Token[] = [];

	protected at() {
		return this.tokens[0] as Token;
	}
	protected eat() {
		return this.tokens.shift() as Token;
	}
	protected isFileEnd(): boolean {
		return this.tokens[0].type === TT.EOF;
	}
	protected expect(type: TT, err: unknown) {
		const prev = this.tokens.shift() as Token;
		if (!prev || prev.type != type) {
			console.error(
				"Parser Error:\n",
				err,
				`getting ${TT[prev.type]}`,
				" - Expecting: ",
				type,
			);
			Deno.exit(1);
		}

		return prev;
	}
}

export class Parser extends TokenManager {
	public parse(sourceCode: string) {
		this.tokens = Lexer.Tokenize(sourceCode);

		const AST = new Program({
			body: [],
		});

		while (!this.isFileEnd()) {
			AST.body.push(this.stmt());
		}

		return AST;
	}

	private stmt(): Stmt {
		return this.expr();
	}

	private expr(): Expr {
		return this.additiveExpr();
	}

	private additiveExpr(): Expr {
		const additiveOperators = ["+", "-"];
		let left = this.multiplicitativeExpr();

		while (additiveOperators.includes(this.at().value)) {
			const operator = this.eat().value;
			const right = this.multiplicitativeExpr();
			left = new Expressions.BinaryOperation({
				left,
				right,
				operator,
			});
		}

		return left;
	}

	private multiplicitativeExpr(): Expr {
		let left = this.primaryExpr();

		while (BinaryOperators.isMultiplicitate(this.at().value)) {
			const operator = this.eat().value;
			const right = this.primaryExpr();
			left = new Expressions.BinaryOperation({
				left,
				right,
				operator,
			});
		}

		return left;
	}

	private primaryExpr(): Expr {
		const tk = this.at().type;

		switch (tk) {
			case TT.Identifier: {
				const symbol = this.eat().value;
				const nextToken = this.at();

				if (nextToken.type == TT.Equals) {
					return this.assignmentExpr(symbol);
				} else if (nextToken.type == TT.OpenParen) {
					return this.functionExpr(symbol);
				} else if (nextToken.type == TT.OpenBrace) {
					// class
				}

				return new Expressions.Identifier({
					symbol,
				});
			}
			case TT.Number: {
				return new Expressions.NumberLiteral({
					value: parseFloat(this.eat().value),
				});
			}
			case TT.OpenParen: {
				this.eat();
				const value = this.expr();
				this.expect(TT.CloseParen, 'Expected ")"');

				return value;
			}
			default: {
				console.error("Unexpected token found during parsing", this.at());
				Deno.exit(1);
			}
		}
	}
	private assignmentExpr(symbol: string): Expr {
		this.eat();
		const stmt = this.stmt();

		return new Expressions.AssignmentExpression({
			symbol,
			value: stmt,
		});
	}

	private args() {
		this.expect(TT.OpenParen, 'Expected "("');

		if (this.at().type == TT.CloseParen) {
			this.eat();

			return [];
		} else {
			const parseIdentifier = () =>
				new Expressions.Identifier({
					symbol: this.expect(TT.Identifier, "Expected string").value,
				});

			const args = [parseIdentifier()];

			while (this.at().type == TT.Comma && this.eat()) {
				args.push(parseIdentifier());
			}

			this.expect(TT.CloseParen, 'Expected ")"');

			return args;
		}
	}

	private functionExpr(symbol: string) {
		const params = this.args().map((p) => p.symbol);

		this.expect(TT.OpenBrace, 'Expected "{"');

		const body: Stmt[] = [];
		while (
			this.at().type !== TT.EOF &&
			this.at().type !== TT.CloseBrace
		) {
			body.push(this.stmt());
		}

		this.eat();

		return new Expressions.FunctionDeclaration({
			symbol,
			body,
			params,
		});
	}
}

export { Expr, Expressions, Program, Stmt };
export default Parser;
