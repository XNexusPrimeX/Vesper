export class BinaryOperators {
	static additive = ["+", "-"];
	static multiplicitate = ["*", "/", "%"];

	static isAdditive(char: string) {
		return this.additive.includes(char);
	}
	static isMultiplicitate(char: string) {
		return this.multiplicitate.includes(char);
	}
	static is(char: string) {
		return [...this.additive, ...this.multiplicitate].includes(char);
	}
}
