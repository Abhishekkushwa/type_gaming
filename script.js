document.addEventListener('DOMContentLoaded', () => {
    const textToTypeElement = document.getElementById('text-to-type');
    const userInputElement = document.getElementById('user-input');
    const errorsElement = document.getElementById('errors');
    const speedElement = document.getElementById('speed');
    const startButton = document.getElementById('start-button');

    const paragraphs = {
        easy: "The quick brown fox jumps over the lazy dog.",
        medium: "Pack my box with five dozen liquor jugs, we quickly judge the fitness of the mixed-up wolf.",
        hard: "Jinxed wizards pluck ivy from the big quilt, giving off mixed signals about how tough the job was."
    };

    let startTime, endTime, typingInterval;
    let words = [];
    let errorCount = 0;

    function initializeGame(difficulty) {
        const paragraph = paragraphs[difficulty];
        words = paragraph.split(' ').map(word => `<span class="word">${word}</span>`);
        textToTypeElement.innerHTML = words.join(' ');
        userInputElement.value = '';
        userInputElement.focus();
        errorCount = 0;
        errorsElement.textContent = `Errors: ${errorCount}`;
        speedElement.textContent = `Speed: 0 WPM`;

        // Start the timer
        startTime = new Date();
        typingInterval = setInterval(updateTypingSpeed, 1000);

        userInputElement.addEventListener('input', checkTyping);
    }

    function checkTyping() {
        const inputText = userInputElement.value;
        const wordsElements = textToTypeElement.querySelectorAll('.word');
        const userWords = inputText.trim().split(' ');

        // Loop through each word element and check against user input
        wordsElements.forEach((wordElement, index) => {
            const userWord = userWords[index] || '';

            // Check if the user's input matches the displayed word
            if (userWord === wordElement.textContent) {
                if (!wordElement.classList.contains('correct')) {
                    wordElement.classList.add('correct');
                    wordElement.classList.remove('incorrect');
                }
                wordElement.classList.add('disabled'); // Disable word
            } else if (userWord.length > 0) {
                if (userWord !== wordElement.textContent) {
                    if (!wordElement.classList.contains('correct')) {
                        wordElement.classList.add('incorrect');
                        wordElement.classList.remove('correct');
                        errorCount++;
                        errorsElement.textContent = `Errors: ${errorCount}`;
                    }
                }
            }
        });

        // Check if the game is complete
        if (userWords.length >= wordsElements.length) {
            const allCorrect = [...wordsElements].every(wordElement => wordElement.classList.contains('correct'));
            if (allCorrect) {
                endTime = new Date();
                clearInterval(typingInterval);
                userInputElement.removeEventListener('input', checkTyping);
                const timeTaken = (endTime - startTime) / 60000; // minutes
                const wordsPerMinute = Math.round(wordsElements.length / timeTaken);
                speedElement.textContent = `Speed: ${wordsPerMinute} WPM`;
            }
        }
    }

    function updateTypingSpeed() {
        if (userInputElement.value.length > 0) {
            const timeTaken = (new Date() - startTime) / 60000; // minutes
            const wordsPerMinute = Math.round(userInputElement.value.trim().split(' ').length / timeTaken);
            speedElement.textContent = `Speed: ${wordsPerMinute} WPM`;
        }
    }

    startButton.addEventListener('click', () => {
        const difficulty = prompt("Choose difficulty: easy, medium, or hard").toLowerCase();
        if (paragraphs[difficulty]) {
            initializeGame(difficulty);
        } else {
            alert("Invalid difficulty level");
        }
    });
});
