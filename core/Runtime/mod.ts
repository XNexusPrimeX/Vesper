import type { Expressions, Program, Stmt } from "../Parser";
import { FunctionValue, NumberValue, RuntimeValue } from "./values.ts";
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

			return evaluate(variable, env);
		}
		case "NumberLiteral": {
			return {
				type: "number",
				value: (astNode as NumberLiteral).value,
			};
		}
		case "BinaryOperation": {
			const binaryOperator = astNode as BinaryOperation;

			const left = <NumberValue> evaluate(binaryOperator.left, env);
			const operator = binaryOperator.operator;
			const right = <NumberValue> evaluate(binaryOperator.right, env);

			const result = eval(`${left.value}${operator}${right.value}`);

			return { type: "number", value: result };
		}
		case "AssignmentExpression": {
			const variable = astNode as AssignmentExpression;

			env.declareVar(variable.symbol, variable.value, false);

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
