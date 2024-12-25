const scriptUrl =
	"https://raw.githubusercontent.com/silladgey/fp-fun-typing/refs/heads/main/automate.js";

function automate() {
	fetch(scriptUrl)
		.then((response) => response.text())
		.then((code) => {
			eval(code); // Only use with trusted code
		})
		.catch((error) => console.error("Error:", error));
}

automate();
