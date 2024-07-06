const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById('score');
const timerElement = document.getElementById('timer');
const loader =document.getElementById('loader');
const game =document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timerInterval;

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
    .then(res => res.json())
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        
        startGame();
    })
    .catch(err => {
        console.error(err);
    });

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign("/end.html");
    }

    questionCounter++;
    questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

    startTimer(); // Start the timer for the new question
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        clearInterval(timerInterval); // Stop the timer when an answer is selected

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

function startTimer() {
    let minutes = 0;
    let seconds = 10;

    function updateTimer() {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval); // Clear the interval
                showAnswerAndReload(); // Show the correct answer
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        displayTime(minutes, seconds);
    }

    function displayTime(minutes, seconds) {
        timerElement.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
    }

    function formatTime(value) {
        return value.toString().padStart(2, '0');
    }

    clearInterval(timerInterval); // Clear any previous timer
    timerInterval = setInterval(updateTimer, 1000);
    displayTime(minutes, seconds); // Display initial time
}

function showAnswerAndReload() {
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        if (number == currentQuestion.answer) {
            choice.parentElement.classList.add('correct');
        }
    });

    setTimeout(() => {
        choices.forEach(choice => choice.parentElement.classList.remove('correct'));
        getNewQuestion();
    }, 2000);
}