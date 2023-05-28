import { Expr, Stmt } from "./structures.ts";

export class AssignmentExpression extends Expr {
	id: Identifier;
	value: any;

	constructor(options: AssignmentExpression) {
		super();

		this.id = options.id;
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
	id: Identifier;
	decorators: Identifier[];
	params: Identifier[];
	body: Stmt[];

	constructor(options: FunctionDeclaration) {
		super();

		this.id = options.id;
		this.decorators = options.decorators;
		this.params = options.params;
		this.body = options.body;
	}
}

export class Identifier extends Expr {
	name: string;

	constructor(options: Identifier) {
		super();

		this.name = options.name;
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
export class CallExpr extends Expr {
	callee: Identifier;
	args: Array<Expr>;

	constructor(options: CallExpr) {
		super();

		this.callee = options.callee;
		this.args = options.args;
	}
}
