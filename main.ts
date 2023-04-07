import Parser from "./core/Parser";
import { createGlobalEnv } from "./core/Runtime/environment.ts";
import { evaluate } from "./core/Runtime";

class Flacid {
	constructor() {
		let [commandName] = Deno.args as [string | undefined, ...any];

		if (commandName?.startsWith("-")) {
			commandName = undefined;
		}

		switch (commandName) {
			case "run":
				this.Run();
				break;

			case "repl":
			case undefined:
				this.Repl();
				break;

			default:
				console.error("Invalid argument");
				Deno.exit(0);
		}
	}

	Repl() {
		const env = createGlobalEnv();

		const parser = new Parser();
		console.log("\nFlacid v0.1");

		while (true) {
			const input = prompt("> ");
			if (!input || input.includes("exit")) {
				Deno.exit(1);
			}

			const program = parser.parse(input);

			if (Deno.args.includes("--ast")) {
				console.log(
					Deno.inspect(program, { showHidden: false, depth: 10, colors: true }),
				);
			}

			const result = evaluate(program, env);
			console.log(result.value);
		}
	}

	Run() {
		throw new Error("Not Implemented");
	}
}

if (import.meta.main) {
	new Flacid();
}
