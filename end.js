const username = document.getElementById('username');
const saveScoreBtn =document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

finalScore.innerText = mostRecentScore;

const highScores = localStorage.setItem('highScores',JSON.stringfy([]));
console.log(highScores)


username.addEventListener("keyup" ,() =>{
    saveScoreBtn.disabled = !username.value;
});
saveHighscore = e =>{
    e.preventDefault();

    const score ={
        score: mostRecentScore,
        name :username.value
    };
    highScores.push(score);
    console.log
};