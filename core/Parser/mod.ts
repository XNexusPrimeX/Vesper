import { BinaryOperators, TokenType as TT } from "@constants";
import { Lexer, Token } from "../Lexer";

import { Expr, Program, Stmt } from "./structures.ts";
import * as Expressions from "./expressions.ts";
import * as Statements from "./statements.ts";

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
	throw(err: unknown) {
		console.error(
			"Parser Error:\n",
			err,
		);
		Deno.exit(1);
	}
}

export class Parser extends TokenManager {
	public parse(sourceCode: string) {
		this.tokens = Lexer.Tokenize(sourceCode);

		const AST = new Program({
			body: [],
		});

		while (!this.isFileEnd()) {
			AST.body.push(this.parseStmt());
		}

		return AST;
	}

	private parseStmt(): Stmt {
		if (this.at().type == TT.Keyword) {
			switch (this.at().value) {
				case "return":
					return this.parseReturnStmt();
				case "if":
					return this.parseIfStmt();
				default:
					return this.parseExpr();
			}
		} else {
			return this.parseExpr();
		}
	}

	private parseExpr(): Expr {
		if (this.at().type == TT.Decorator) {
			return this.parseDecorator();
		} else {
			return this.parseAdditiveExpr();
		}
	}

	private parseAdditiveExpr(): Expr {
		const additiveOperators = ["+", "-"];
		let left = this.parseMultiplicitativeExpr();

		while (additiveOperators.includes(this.at().value)) {
			const operator = this.eat().value;
			const right = this.parseMultiplicitativeExpr();
			left = new Expressions.BinaryOperation({
				left,
				right,
				operator,
			});
		}

		return left;
	}

	private parseMultiplicitativeExpr(): Expr {
		let left = this.parsePrimaryExpr();

		while (BinaryOperators.isMultiplicitate(this.at().value)) {
			const operator = this.eat().value;
			const right = this.parsePrimaryExpr();
			left = new Expressions.BinaryOperation({
				left,
				right,
				operator,
			});
		}

		return left;
	}

	private parseIfStmt() {
	}

	private parsePrimaryExpr(): Expr {
		const tk = this.at().type;

		switch (tk) {
			case TT.Identifier: {
				const ident = new Expressions.Identifier({
					name: this.eat().value,
				});

				const nextToken = this.at();
				if (nextToken.type == TT.Equals) {
					return this.parseAssignmentExpr(ident);
				} else if (nextToken.type == TT.OpenParen) {
					return this.parseFunctionExpr(ident);
				} else if (nextToken.type == TT.OpenBrace) {
					// class
				}

				return ident;
			}
			case TT.Number: {
				return new Expressions.NumberLiteral({
					value: parseFloat(this.eat().value),
				});
			}
			case TT.String: {
				return new Expressions.StringLiteral({
					value: this.eat().value,
				});
			}
			case TT.OpenParen: {
				this.eat();
				const value = this.parseExpr();
				this.expect(TT.CloseParen, 'Expected ")"');

				return value;
			}
			default: {
				console.error("Unexpected token found during parsing", this.at());
				Deno.exit(1);
			}
		}
	}
	private parseAssignmentExpr(id: Expressions.Identifier): Expr {
		this.eat();
		const stmt = this.parseStmt();

		return new Expressions.AssignmentExpression({
			id,
			value: stmt,
		});
	}

	private parseArgs() {
		this.expect(TT.OpenParen, 'Expected "("');

		if (this.at().type == TT.CloseParen) {
			this.eat();

			return [];
		} else {
			const args = [this.parseExpr()];

			while (this.at().type == TT.Comma && this.eat()) {
				args.push(this.parseExpr());
			}

			this.expect(TT.CloseParen, 'Expected ")"');

			return args;
		}
	}

	private parseDecorator() {
		const decorators = new Array<Expressions.Identifier>();

		while (this.at().type == TT.Decorator) {
			this.eat();
			const identifier = this.parseExpr();

			if (identifier.constructor.name !== "Identifier") {
				this.throw("Expected Identifier");
			} else {
				decorators.push(identifier as Expressions.Identifier);
			}
		}

		const element = this.parseExpr();

		if (["FunctionDeclaration"].includes(element.constructor.name)) {
			(element as Expressions.FunctionDeclaration).decorators = decorators;
		} else {
			this.throw("decorators are not valid here");
		}

		return element;
	}

	private parseFunctionExpr(id: Expressions.Identifier) {
		const args = this.parseArgs();

		if (this.at().type == TT.OpenBrace) {
			this.eat();

			const body: Stmt[] = [];
			while (
				this.at().type !== TT.EOF &&
				this.at().type !== TT.CloseBrace
			) {
				body.push(this.parseStmt());
			}

			const argsAreIdent = args.every((a) =>
				a.constructor.name === "Identifier"
			);
			if (!argsAreIdent) {
				this.throw("Params of function declaration needs be a 'Identifier'");
			}

			this.expect(TT.CloseBrace, 'Expected "}"');

			return new Expressions.FunctionDeclaration({
				id,
				decorators: [],
				body,
				params: args as Array<Expressions.Identifier>,
			});
		} else {
			return new Expressions.CallExpr({
				callee: id,
				args,
			});
		}
	}

	private parseReturnStmt() {
		this.eat();

		return new Statements.ReturnStmt({
			arg: this.parseStmt(),
		});
	}
}

export { Expr, Expressions, Program, Statements, Stmt };
export default Parser;
