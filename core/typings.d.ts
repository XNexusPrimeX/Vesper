declare global {
	interface Array<T> {
		shift(): T;
	}
}

export {};
