import type { Expressions, Program, Stmt } from "../Parser";
import { FunctionValue, RuntimeValue } from "./values.ts";
import Environment from "./environment.ts";
import {
	AssignmentExpression,
	BinaryOperation,
	Identifier,
	NumberLiteral,
} from "../Parser/expressions.ts";

type AllStmts = keyof typeof Expressions | "Program";

export function evaluate(astNode: Stmt, env: Environment): RuntimeValue {
	switch (astNode.constructor.name as AllStmts) {
		case "Program": {
			let lastEvaluated = { type: "null", value: null } as RuntimeValue;
			for (const statement of (astNode as Program).body) {
				lastEvaluated = evaluate(statement, env);
			}

			return lastEvaluated;
		}
		case "FunctionDeclaration": {
			const declaration = astNode as Expressions.FunctionDeclaration;

			const fn = {
				type: "function",
				name: declaration.symbol,
				parameters: declaration.params,
				declarationEnv: env,
				body: declaration.body,
			} as FunctionValue;

			env.declareVar(declaration.symbol, fn, true);

			return { type: "null", value: null };
		}
		case "Identifier": {
			const variable = env.lookupVar((astNode as Identifier).symbol);

			console.log("identifier?? huh");

			return evaluate(variable, env);
		}
		case "NumberLiteral": {
			return {
				type: "number",
				value: (astNode as NumberLiteral).value,
			};
		}
		case "BinaryOperation": {
			const { left, operator, right } = astNode as BinaryOperation;

			const result = eval(`${left}${operator}${right}`);

			return { type: "number", value: result };
		}
		case "AssignmentExpression": {
			const variable = astNode as AssignmentExpression;

			console.log("testing");
			env.declareVar(variable.symbol, variable.value, false);
			console.log(env.lookupVar(variable.symbol));

			return { type: "null", value: null };
		}
		default: {
			console.error(
				"This AST Node has not yet been setup for interpretation.\n",
				astNode,
			);
			Deno.exit(0);
		}
	}
}
