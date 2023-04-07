import { Expr, Stmt } from "./structures.ts";

export class AssignmentExpression extends Expr {
	symbol: string;
	value: any;

	constructor(options: AssignmentExpression) {
		super();

		this.symbol = options.symbol;
		this.value = options.value;
	}
}

export class BinaryOperation extends Expr {
	left: Expr;
	right: Expr;
	operator: string;

	constructor(options: BinaryOperation) {
		super();

		this.left = options.left;
		this.right = options.right;
		this.operator = options.operator;
	}
}

export class FunctionDeclaration extends Expr {
	symbol: string;
	params: string[];
	body: Stmt[];

	constructor(options: FunctionDeclaration) {
		super();

		this.symbol = options.symbol;
		this.params = options.params;
		this.body = options.body;
	}
}

export class Identifier extends Expr {
	symbol: string;

	constructor(options: Identifier) {
		super();

		this.symbol = options.symbol;
	}
}

export class NumberLiteral extends Expr {
	value: number;

	constructor(options: NumberLiteral) {
		super();

		this.value = options.value;
	}
}
export class StringLiteral extends Expr {
	value: string;

	constructor(options: StringLiteral) {
		super();

		this.value = options.value;
	}
}
export class BooleanLiteral extends Expr {
	value: boolean;

	constructor(options: BooleanLiteral) {
		super();

		this.value = options.value;
	}
}
