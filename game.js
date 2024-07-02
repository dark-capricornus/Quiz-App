const question =document.getElementById('question');
const choices =Array.from(document.getElementsByClassName('choice-text'));

let currentQuestion ={};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions =[];
let questions = [
    {
        question: "What is the largest planet in our solar system?",
        choice1: "<Earth>",
        choice2: "<Jupiter>",
        choice3: "<Mars>",
        choice4: "<Venus>",
        Answer: 2
    },
    {
        question: "Who wrote the play 'Romeo and Juliet'? ",
        choice1: "<William Shakespeare>",
        choice2: "<Charles Dickens>",
        choice3: "<Mark Twain>",
        choice4: "<Jane Austen>",
        Answer: 1
    },
    {
        question: "which element has atomic number 1",
        choice1: "<Hydrogen>",
        choice2: "<Helium>",
        choice3: "<Oxygen>",
        choice4: "<Carbon>",
        Answer: 1
    },
    {
        question: "What is the chemical symbol for water?",
        choice1: "<H₂O>",
        choice2: "<CO₂>",
        choice3: "<O₂>",
        choice4: "<H₂>",
        Answer: 1
    },
]

const  CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = ()=> {
    questionCounter = 0;
    score = 0 ;
    availableQuestions = [...questions];
    console.log(availableQuestions)
    getNewQuestion();
};
getNewQuestion = ()=> {
    if(availableQuestions.length == 0 ||questionCounter >=  MAX_QUESTIONS){
    // go to the end of the page
        return window.location.assign("/end.html") ;
       }

    questionCounter++;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion =availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText =currentQuestion["choice" + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers =true;
};
choices.forEach(choice =>{
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;
        
        acceptingAnswers =false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        getNewQuestion();
    });
})
startGame();