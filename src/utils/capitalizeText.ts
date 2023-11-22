export function capitalizeText ( text: string): string {								// It only allows capital letters in the 1st character, converts the rest to lower case so that the name is not too large in size.
	let capitalizedText = "";

	for (let i = 0; i < text.length; i++) {											
		if (i === 0) {
			capitalizedText = capitalizedText + text[i];
		} else {
			capitalizedText = capitalizedText + text[i].toLowerCase();
		}
	}

	return capitalizedText;
}