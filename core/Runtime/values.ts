import type { Stmt } from "../Parser";
import Environment from "./environment.ts";

export type ValueType =
	| "null"
	| "number"
	| "boolean"
	| "object"
	| "function";

export type FunctionCall = (
	args: RuntimeValue[],
	env: Environment,
) => RuntimeValue;

export interface NativeFunctionValue {
	type: "native-function";
	call: FunctionCall;
}

export interface NullValue {
	type: "null";
	value: null;
}

export interface StringValue {
	type: "string";
	value: string;
}

export interface BooleanValue {
	type: "boolean";
	value: boolean;
}

export interface NumberValue {
	type: "number";
	value: number;
}

export interface ObjectValue {
	type: "object";
	properties: Map<string, RuntimeValue>;
}

export interface FunctionValue {
	type: "function";
	name: string;
	decorators: string[];
	parameters: string[];
	declarationEnv: Environment;
	body: Stmt[];
}

export type RuntimeValue =
	| NullValue
	| NumberValue
	| BooleanValue
	| StringValue
	| FunctionValue
	| NativeFunctionValue;
