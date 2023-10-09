function generateSquares () {
	const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
	let result: string[] = [];
	letters.map( (letter) => {
		for (let i = 1; i <= 8; i++) {
			result = [...result, `${letter}${i}`];
		}
	});

	return result;
}

export default generateSquares;