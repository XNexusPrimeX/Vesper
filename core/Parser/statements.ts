import { Stmt } from "./structures.ts";

export class ReturnStmt extends Stmt {
	arg: any;

	constructor(options: ReturnStmt) {
		super();

		this.arg = options.arg;
	}
}
