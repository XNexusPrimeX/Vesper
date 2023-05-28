import type { Expressions, Program, Statements, Stmt } from "../Parser";
import {
	FunctionValue,
	NativeFunctionValue,
	NumberValue,
	RuntimeValue,
} from "./values.ts";
import Environment from "./environment.ts";
import {
	AssignmentExpression,
	BinaryOperation,
	CallExpr,
	Identifier,
	NumberLiteral,
	StringLiteral,
} from "../Parser/expressions.ts";

type AllStmts =
	| keyof typeof Expressions
	| keyof typeof Statements
	| "Program";

export function evaluate(astNode: Stmt, env: Environment): RuntimeValue {
	switch (astNode.constructor.name as AllStmts) {
		case "Program": {
			let lastEvaluated = { type: "null", value: null } as RuntimeValue;
			for (const statement of (astNode as Program).body) {
				lastEvaluated = evaluate(statement, env);

				if (env.returned) {
					return lastEvaluated;
				}
			}

			return lastEvaluated;
		}
		case "FunctionDeclaration": {
			const declaration = astNode as Expressions.FunctionDeclaration;

			const fn = {
				type: "function",
				name: declaration.id.name,
				decorators: declaration.decorators.map((d) => d.name),
				parameters: declaration.params.map((p) => p.name),
				declarationEnv: env,
				body: declaration.body,
			} as FunctionValue;

			env.declareVar(declaration.id.name, fn, true);

			return { type: "null", value: null };
		}
		case "Identifier": {
			return env.lookupVar((astNode as Identifier).name);
		}
		case "NumberLiteral": {
			return {
				type: "number",
				value: (astNode as NumberLiteral).value,
			};
		}
		case "StringLiteral": {
			return {
				type: "string",
				value: (astNode as StringLiteral).value,
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

			env.declareVar(variable.id.name, evaluate(variable.value, env), false);

			return { type: "null", value: null };
		}
		case "CallExpr": {
			const callExpr = astNode as CallExpr;
			const functionValue = <FunctionValue | NativeFunctionValue> env.lookupVar(
				callExpr.callee.name,
			);
			const argValues = callExpr.args.map((arg) => evaluate(<Stmt> arg, env));

			if (functionValue.type === "native-function") {
				return functionValue.call(argValues, env);
			} else if (functionValue.decorators.length > 0) {
				const functionEnv = new Environment(env);

				return { type: "null", value: null };
			} else if (functionValue.type === "function") {
				functionValue.parameters.forEach((param, i) => {
					functionEnv.declareVar(param, argValues[i], false);
				});

				let lastEvaluated: RuntimeValue = { type: "null", value: null };
				for (const stmt of functionValue.body) {
					lastEvaluated = evaluate(stmt, functionEnv);

					if (functionEnv.returned) {
						return lastEvaluated;
					}
				}

				return { type: "null", value: null };
			} else {
				console.error("This variable is not a function");
				Deno.exit(0);

				throw "";
			}
		}
		case "ReturnStmt": {
			const returnStatement = astNode as Statements.ReturnStmt;
			const returnValue = evaluate(returnStatement.arg, env);
			env.returned = true;

			return returnValue;
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
