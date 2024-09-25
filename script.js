document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.querySelector('.question');
    const optionButtons = document.querySelectorAll('.option');
    const quizBody = document.querySelector('.quiz-body');

    let timerElement, timerBarElement;
    let timer, nextQuestionTimer;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateQuestion() {
        const num1 = getRandomInt(1, 20); // Single or double digit
        const num2 = getRandomInt(1, 9);  // Single digit
        const correctAnswer = num1 * num2;

        // Generate close and confusing options
        const options = new Set();
        options.add(correctAnswer);
        while (options.size < 4) {
            const option = correctAnswer + getRandomInt(-5, 5);
            if (option > 0) {
                options.add(option);
            }
        }

        return {
            question: `${num1} x ${num2} = ?`,
            options: Array.from(options).sort(() => Math.random() - 0.5),
            answer: correctAnswer
        };
    }

    function showQuestion(question) {
        questionElement.textContent = question.question;
        optionButtons.forEach((button, index) => {
            button.textContent = question.options[index];
            button.onclick = () => selectOption(button, index, question.answer);
            button.classList.remove('correct', 'wrong');
            const icon = button.querySelector('.feedback-icon');
            if (icon) {
                icon.remove();
            }
        });

        if (timerElement) {
            timerElement.remove();
        }

        timerElement = document.createElement('div');
        timerElement.className = 'timer';
        timerBarElement = document.createElement('div');
        timerBarElement.className = 'timer-bar';
        timerElement.appendChild(timerBarElement);
        quizBody.appendChild(timerElement);

        // Start the timer animation
        setTimeout(() => {
            timerBarElement.style.width = '100%';
        }, 0);

        // Automatically expose the correct answer after 3 seconds
        timer = setTimeout(() => {
            exposeCorrectAnswer(question.answer);
        }, 3000);
    }

    function selectOption(button, index, correctAnswer) {
        clearTimeout(timer);
        exposeCorrectAnswer(correctAnswer, index);
    }

    function exposeCorrectAnswer(correctAnswer, selectedIndex = null) {
        optionButtons.forEach((button, index) => {
            const icon = document.createElement('span');
            icon.className = 'feedback-icon';

            if (parseInt(button.textContent) === correctAnswer) {
                button.classList.add('correct');
                icon.textContent = '✔'; // Check mark for correct
            } else if (index === selectedIndex) {
                button.classList.add('wrong');
                icon.textContent = '✖'; // Cross mark for wrong
            }

            button.appendChild(icon);
        });

        // Automatically move to the next random question after 1 second
        nextQuestionTimer = setTimeout(() => {
            showQuestion(generateQuestion());
        }, 1000);
    }

    showQuestion(generateQuestion());
});
