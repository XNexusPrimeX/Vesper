import Parser from "./core/Parser";
import { createGlobalEnv } from "./core/Runtime/environment.ts";
import { evaluate } from "./core/Runtime";

class Flacid {
	args: Array<string | undefined> = [...Deno.args];

	constructor() {
		let commandName = this.args.shift();

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
			if (!input || input.includes(".exit")) {
				Deno.exit(1);
			}

			const program = parser.parse(input);

			console.log(program);

			if (this.args.includes("--ast")) {
				console.log(
					Deno.inspect(program, { showHidden: false, depth: 10, colors: true }),
				);
			}

			const result = evaluate(program, env);

			console.log(result.value);
			if ("value" in result) {
			}
		}
	}

	Run() {
		const filePath = this.args.shift();
		const completePath = null;

		const parser = new Parser();
		const env = createGlobalEnv();

		const data = Deno.readTextFileSync(completePath);
		const program = parser.parse(data);
		evaluate(program, env);
	}
}

if (import.meta.main) {
	new Flacid();
}
