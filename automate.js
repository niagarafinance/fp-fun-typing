function extractWords() {
	const wordsContainer = document.evaluate(
		'//*[@id="root"]/div/main/div[1]/div[1]/div[2]/div',
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	).singleNodeValue;

	if (!wordsContainer) {
		console.error("Words container not found");
		return [];
	}

	// Extract words from span elements
	const wordSpans = Array.from(wordsContainer.querySelectorAll("span"))
		.filter((span) => !span.classList.contains("absolute"))
		.map((span) => {
			// Remove any triangle symbols from the text
			return span.textContent.replace("▼", "").trim();
		});

	return wordSpans;
}

function findInputElement() {
	// Try desktop input first
	let input = document.evaluate(
		'//*[@id="root"]/div/main/div[1]/div[2]/div[2]/input[1]',
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	).singleNodeValue;

	// If not found, try mobile input
	if (!input) {
		input = document.evaluate(
			'//*[@id="root"]/div/main/div[1]/div[2]/div[2]/input[2]',
			document,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;
	}

	return input;
}

function simulateKeyPress(inputElement, character) {
	// Create and dispatch the keydown event
	const keyDownEvent = new KeyboardEvent("keydown", {
		key: character,
		code: `Key${character.toUpperCase()}`, // Adjust for letters
		charCode: character.charCodeAt(0),
		keyCode: character.charCodeAt(0),
		bubbles: true,
		cancelable: true,
	});
	inputElement.dispatchEvent(keyDownEvent);

	// Create and dispatch the keypress event (deprecated but included for completeness)
	const keyPressEvent = new KeyboardEvent("keypress", {
		key: character,
		code: `Key${character.toUpperCase()}`,
		charCode: character.charCodeAt(0),
		keyCode: character.charCodeAt(0),
		bubbles: true,
		cancelable: true,
	});
	inputElement.dispatchEvent(keyPressEvent);

	// Update the value of the input element to reflect the pressed character
	inputElement.value += character; // Append the character

	// Create and dispatch the input event to notify changes
	const inputEvent = new Event("input", {
		bubbles: true,
		cancelable: true,
	});
	inputElement.dispatchEvent(inputEvent);

	// Create and dispatch the keyup event
	const keyUpEvent = new KeyboardEvent("keyup", {
		key: character,
		code: `Key${character.toUpperCase()}`,
		charCode: character.charCodeAt(0),
		keyCode: character.charCodeAt(0),
		bubbles: true,
		cancelable: true,
	});
	inputElement.dispatchEvent(keyUpEvent);
}

function simulateSpacebarPress(inputElement) {
	// Create and dispatch the keydown event
	const keyDownEvent = new KeyboardEvent("keydown", {
		key: " ",
		code: "Space",
		keyCode: 32,
		which: 32,
		bubbles: true,
		cancelable: true,
	});
	inputElement.dispatchEvent(keyDownEvent);

	// Create and dispatch the keypress event (deprecated but included for completeness)
	const keyPressEvent = new KeyboardEvent("keypress", {
		key: " ",
		code: "Space",
		charCode: 32,
		keyCode: 32,
		which: 32,
		bubbles: true,
		cancelable: true,
	});
	inputElement.dispatchEvent(keyPressEvent);

	// Update the value of the input element to reflect the space character
	inputElement.value += " "; // Append a space character

	// Create and dispatch the input event to notify changes
	const inputEvent = new Event("input", {
		bubbles: true,
		cancelable: true,
	});
	inputElement.dispatchEvent(inputEvent);

	// Create and dispatch the keyup event
	const keyUpEvent = new KeyboardEvent("keyup", {
		key: " ",
		code: "Space",
		keyCode: 32,
		which: 32,
		bubbles: true,
		cancelable: true,
	});
	inputElement.dispatchEvent(keyUpEvent);
}

// Main auto-typing function
function autoType() {
	const input = findInputElement();

	if (!input) {
		console.error("Input element not found");
		return;
	}

	const words = extractWords();

	// Function to type a single word
	function typeNextWord(index = 0) {
		if (index >= words.length) {
			console.log("Finished typing all words");
			return;
		}

		const word = words[index];
		console.log(`Typing word: ${word}`);

		// Simulate typing
		let i = 0;
		function typeCharacter() {
			if (i < word.length) {
				simulateKeyPress(input, word[i]);
				console.log(`Typed character: ${word[i]}`);
				i++;
				setTimeout(typeCharacter, 100);
			} else {
				simulateSpacebarPress(input);
				setTimeout(() => typeNextWord(index + 1), 100);
			}
		}
		typeCharacter();
	}

	// Start typing
	typeNextWord();
}

autoType();
