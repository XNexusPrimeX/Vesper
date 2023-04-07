export abstract class Stmt {}
export abstract class Expr extends Stmt {}
export class Program {
	body: Stmt[];

	constructor(obj: Program) {
		this.body = obj.body;
	}
}
