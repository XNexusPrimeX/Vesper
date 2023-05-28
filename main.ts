import Parser from "./core/Parser";
import { createGlobalEnv } from "./core/Runtime/environment.ts";
import { evaluate } from "./core/Runtime";

class Flacid {
	args: Array<string | undefined> = [...Deno.args];

	constructor() {
		const commandName = (() => {
			if (this.args[0]?.startsWith("-")) return undefined;

			return this.args.shift();
		})();

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

			if (this.args.includes("--ast")) {
				console.log(
					Deno.inspect(program, { showHidden: false, depth: 10, colors: true }),
				);
			}

			const result = evaluate(program, env);

			if ("value" in result) {
				console.log(result.value);
			}
		}
	}

	Run() {
		const filePath = this.args.shift();
		const completePath = Deno.cwd() + `/${filePath}`;

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
