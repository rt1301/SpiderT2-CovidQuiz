var sideMenu = document.getElementById("side-menu");
var pageNum = document.getElementById("page-num");
var main = document.getElementById("main");
var leftBtn = document.getElementById('left');
var rightBtn = document.getElementById('right');
var answer = document.querySelector('.answer');
var explanation = document.querySelector('.explanation');
var scoreBoard = document.getElementById("scoreDisplay");
var nameDisplay = document.getElementById("nameDisplay");
var checkedOption;
var Optionlist = document.getElementsByClassName('option');
var quiz;
var quizArea = document.querySelector(".quiz-area");
var intro = document.querySelector('.intro');
var nameInput = document.getElementById('name');
var startBtn  = document.getElementById("start");
var name;
var answerLink;
var ls_keys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
var index = 0;
var start = true;
var burger = document.querySelector('.burger');
var closeBtn = document.querySelector('.btn-close');
function startQuiz()
{
    nameInput.addEventListener('input',()=>{
        name = nameInput.value;
    });
    startBtn.addEventListener('click',()=>{
        intro.classList.add('hide');
        quizArea.classList.remove('hide');
    });
}
startQuiz();
const quizQues = async function() {
    if(start)
    {
        const res = await fetch("./quiz.json");
        quiz = await res.json();
        shuffle(quiz);
        sideNavList();
        start = false;
    }
    quizDisplay(pageNum.textContent);
    chooseOption();
    modalDisplay(Number(pageNum.textContent));
    checkedButton();
}

function sideNavList() {
    for (var i = 0; i < quiz.length; i++) {
        var link = document.createElement('a');
        link.innerHTML = `<span id='q${i+1}' class='nav-index'>${i+1}.</span>  ${quiz[i].question}`;
        sideMenu.appendChild(link);
    }
    burger.addEventListener('click',()=>{
        sideMenu.style.width = '400px';
        document.querySelector('section').style.marginRight = '400px';
    });
    closeBtn.addEventListener('click',()=>{
        sideMenu.style.width = '0px';
        document.querySelector('section').style.marginRight = '0px';
    });
}
// Fisher-Yates Shuffle Algorithm
function shuffle(array) 
{
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}
function modalDisplay(option) {
    var modalBtn = document.querySelector('#submitBtn');
    var modalBg = document.querySelector(".modal-bg");
    var close = document.querySelector(".modal-close");
    var answerIndex = quiz[option - 1].answer;
    var expl = quiz[option - 1].explanation;
    answerLink = document.getElementById(`q${option}`);
    console.log(answerLink);
    explanation.innerHTML = '<strong class="title">Explanation: </strong>' + expl;
    modalBtn.addEventListener('click', () => {
        chooseOption();
        sessionStorage.setItem(ls_keys[pageNum.textContent - 1], checkedOption);
        modalBg.classList.add('bg-active');
        if(sessionStorage.length === 11)
        {
            calcScore();
            document.querySelector('.score').classList.remove('hide');
            document.querySelector('.participant').classList.remove('hide');
        }
        if (checkedOption === quiz[option - 1].options[answerIndex]) {
            var output = "Correct Answer";
            answer.innerHTML = '<i class="far fa-check-circle"></i>  ' + output;
            answerLink.style.color = '#155724';
            answerLink.style.background = '#d4edda';
            answer.classList.add('correct');
            answer.classList.remove('wrong');
        } else {
            var output = "Incorrect Answer";
            answerLink.style.color = '#721c24';
            answerLink.style.background = '#f8d7da';
            answer.innerHTML = '<i class="far fa-times-circle"></i>  ' + output;
            answer.classList.remove('correct');
            answer.classList.add('wrong');
        }
    });
    close.addEventListener('click', () => {
        modalBg.classList.remove('bg-active');
        answerLink = '';
    });
}

function quizDisplay(option) {
    var output = `<div class='image'><img class="quiz-img" src=${quiz[option-1].img}></div><div class="question">${option}. ${quiz[option-1].question}</div>`;
    var optionLength = Object.keys(quiz[option - 1].options).length;
    var optionStr = '<div class="option-container">';
    for (var i = 0; i < optionLength; i++) {
        var optionData = quiz[option - 1].options[i + 1];
        optionStr += `<div class="options"><input class='option question${i+1}' id='q${option}_op${i+1}' type="radio" name="options" value='${quiz[option - 1].options[i + 1]}'>   <label class='option${i+1}'>${quiz[option - 1].options[i + 1]}</label></div><br>`;
    }
    optionStr += "</div>"
    output += optionStr;
    main.innerHTML = output;
}

function chooseOption() {
    for (var i = 0; i < Optionlist.length; i++) {
        if (Optionlist[i].checked) {
            checkedOption = Optionlist[i].value;
        }
    }

}

function calcScore() {
    var items = [];
    var score = 0;
    for (var i = 0; i < sessionStorage.length - 1; i++) {
        items[i] = sessionStorage.getItem(ls_keys[i]);
        if (items[i] === quiz[i].options[quiz[i].answer]) {
            score++;
        }
    }
    if(sessionStorage.length === 11)
    {
        displayScore(score);
    }
}

function checkedButton() {
    if (sessionStorage.getItem(`q${pageNum.textContent}`)) {
        var selected = sessionStorage.getItem(`q${pageNum.textContent}`);
        document.querySelector(`input[value="${selected}"]`).checked = true;
    }
}

function displayScore(score) {
    scoreBoard.innerText = score;
    nameDisplay.innerText = name;
}

function pageNav() {
    quizQues();
    leftBtn.addEventListener('click', () => {
        if (Number(pageNum.textContent) > 1) {
            var num = Number(pageNum.textContent);
            num--;
            pageNum.textContent = num;
            quizQues();
            calcScore();
        } else {
            return;
        }
    });
    rightBtn.addEventListener('click', () => {
        if (Number(pageNum.textContent) < quiz.length) {
            var num = Number(pageNum.textContent);
            num++;
            pageNum.textContent = num;
            quizQues();
            calcScore();
        } else {
            return;
        }
    });
}
pageNav();